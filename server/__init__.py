import socket
import subprocess
from adbutils import AdbDevice
from server import scrcpy_receiver, reporter_receiver
from utils.adb_controller import get_adb_device
from utils.logger import LOGGER, LogType

# audio capture is only available since Android 11
AUDIO_MINIMAL_SDK_VERSION = 30

def is_audio_supported(device: AdbDevice) -> bool:
    sdk_version = device.shell("getprop ro.build.version.sdk")
    assert type(sdk_version) == str
    if not sdk_version.strip().isdigit():
        LOGGER.write(LogType.Error, "Failed to read device SDK version, audio disabled.")
        return False
    if int(sdk_version) < AUDIO_MINIMAL_SDK_VERSION:
        LOGGER.write(LogType.Server, "Device is older than Android 11, audio disabled.")
        return False
    return True

def deploy_scrcpy_server(enable_audio: bool=False) -> tuple[subprocess.Popen, socket.socket, socket.socket | None] | Exception:
    primary_device = get_adb_device()
    if isinstance(primary_device, Exception): return primary_device

    scrcpy_receiver.push_server(primary_device)
    primary_device.forward(f"tcp:{scrcpy_receiver.SERVER_PORT}", "localabstract:scrcpy")

    # requesting audio from a device that can not capture it
    # makes the server abort, which would break the input sharing too
    enable_audio = enable_audio and is_audio_supported(primary_device)

    server_process = scrcpy_receiver.server_process_factory(enable_audio)
    if isinstance(server_process, Exception):
        return server_process

    # with the video stream disabled, the audio socket is the first one
    # to be connected, so it is the one receiving the dummy byte
    audio_socket = None
    if enable_audio:
        audio_socket = scrcpy_receiver.try_connect_server("localhost")
        if isinstance(audio_socket, Exception):
            server_process.terminate()
            return audio_socket

    client_socket = scrcpy_receiver.try_connect_server("localhost", expect_dummy_byte=not enable_audio)
    if isinstance(client_socket, Exception):
        audio_socket and audio_socket.close()
        server_process.terminate()
        return client_socket

    return server_process, client_socket, audio_socket

def deploy_reporter_server() -> Exception | None:
    primary_device = get_adb_device()
    if isinstance(primary_device, Exception): return primary_device
    primary_device.forward(f"tcp:{reporter_receiver.SERVER_PORT}", f"tcp:{reporter_receiver.SERVER_PORT}")

    package_path    = primary_device.shell("pm path " + reporter_receiver.PACKAGE_NAME)
    package_version = primary_device.shell(f"dumpsys package {reporter_receiver.PACKAGE_NAME} | grep versionName")
    assert type(package_path) == str and type(package_version) == str
    parsed_version = package_version.split("=")[1] if package_version else ""
    not_installed  = len(package_path) == 0
    is_outdated    = parsed_version != reporter_receiver.PACKAGE_VERSION
    if not_installed or is_outdated:
        if not_installed: LOGGER.write(LogType.Server, "Reporter not installed, installing...")
        elif is_outdated: LOGGER.write(LogType.Server, "Reporter outdated, updating...")
        if (res := reporter_receiver.install_server(primary_device)) is not None:
            return res

    return reporter_receiver.start_server(primary_device)
