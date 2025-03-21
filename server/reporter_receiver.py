import socket
import threading
import time
from pathlib import Path

from adbutils import AdbDevice
from utils import DevicePosition, VoidCallable, script_abs_path
from utils.logger import LOGGER, LogType
from utils.network import get_port

PACKAGE_NAME = "com.bhznjns.inputsharereporter"
PACKAGE_VERSION = "1.1.0"
ENTRY_ACTIVITY_NAME = ".MainActivity"
SERVER_EXECUTABLE_NAME = "reporter.apk"
SERVER_PORT = get_port("reporter_port", 61625)
SERVER_RETRY_INTERVAL = 2

SERVER_EVENT_KEEPALIVE = 0x00
SERVER_EVENT_TOGGLE    = 0x01
SERVER_EVENT_EDGE_TOGGLING_PAUSE  = 0x02
SERVER_EVENT_EDGE_TOGGLING_RESUME = 0x03

def install_server(device: AdbDevice) -> Exception | None:
    from adbutils import AdbInstallError

    script_path = script_abs_path(__file__)
    server_binary_path = Path.joinpath(script_path, SERVER_EXECUTABLE_NAME)
    try:
        device.install(str(server_binary_path))
    except AdbInstallError | BrokenPipeError as e:
        LOGGER.write(LogType.Error, "Reporter install error: " + str(e))
        return e
    except Exception as e:
        from utils.logger import unreachable
        unreachable()
        return e

def start_server(device: AdbDevice) -> Exception | None:
    from adbutils import AdbTimeout
    from utils.config_manager import get_config

    try:
        is_server_running = device.shell(f"pidof {PACKAGE_NAME}")
        assert type(is_server_running) == str
        if len(is_server_running) > 0: LOGGER.write(LogType.Server, "Reporter server is already running.")
        else: LOGGER.write(LogType.Server, "Reporter server is not running, try to start...")

        config_position = get_config().device_position
        param_direction = DevicePosition.parse(config_position)
        device.shell(f"am start -n {PACKAGE_NAME}/{PACKAGE_NAME + ENTRY_ACTIVITY_NAME} -e \"direction\" \"{param_direction}\"")
    except AdbTimeout as e:
        LOGGER.write(LogType.Server, "Start reporter server timeout.")
        return e

def server_receiver_factory() -> VoidCallable:
    from input.controller import schedule_toggle as main_schedule_toggle
    from input.edge_portal import pause_edge_toggling, resume_edge_toggling,\
                                  call_edge_toggling_callbacks
    from utils.config_manager import get_config
    edge_toggling_enabled = get_config().edge_toggling

    def data_recv(client_socket: socket.socket):
        data = client_socket.recv(16)
        if len(data) > 0:
            event_type = data[0]
            if   event_type == SERVER_EVENT_KEEPALIVE: pass
            elif event_type == SERVER_EVENT_TOGGLE and edge_toggling_enabled:
                main_schedule_toggle(False); call_edge_toggling_callbacks()
            elif event_type == SERVER_EVENT_EDGE_TOGGLING_PAUSE : pause_edge_toggling()
            elif event_type == SERVER_EVENT_EDGE_TOGGLING_RESUME: resume_edge_toggling()
            else: LOGGER.write(LogType.Server, "Unexpected reporter event: " + str(data))
            return True
        else:
            LOGGER.write(LogType.Server, "Reporter server closed connection.")
            return False

    def receiver():
        nonlocal client_socket, client_stop_event
        while not client_stop_event.is_set():
            client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            try:
                client_socket.connect(("localhost", SERVER_PORT))
                LOGGER.write(LogType.Server, "Reporter connected.")
                connected = True
            except ConnectionRefusedError:
                LOGGER.write(LogType.Server, "Reporter connecting failed, going to retry...")
                connected = False
            except Exception as e:
                LOGGER.write(LogType.Server, "Unexcepted reporter connecting error: " + str(e))
                connected = False

            while connected:
                try:
                    if not data_recv(client_socket): break
                except (ConnectionAbortedError, ConnectionResetError) as e:
                    LOGGER.write(LogType.Error, "Connection error: " + str(e))
                    break
                except Exception as e:
                    LOGGER.write(LogType.Error, "Getting toggling data error: " + str(e))
                    break
            client_socket.close()
            time.sleep(SERVER_RETRY_INTERVAL)
            LOGGER.write(LogType.Server, "Reporter retry connection.")

        LOGGER.write(LogType.Server, "Reporter receiver stopped.")

    def stop_receiver():
        nonlocal client_socket, thread, client_stop_event
        assert type(client_socket) == socket.socket
        client_stop_event.set()
        client_socket.close()
        thread.join()

    client_socket: socket.socket | None = None
    client_stop_event = threading.Event()
    thread = threading.Thread(target=receiver)
    thread.start()

    return stop_receiver
