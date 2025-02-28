import socket
import threading
import socket
import subprocess
import time

from pathlib import Path
from adbutils import AdbDevice
from scrcpy_client.clipboard_event import GetClipboardEventResponse
from utils import script_abs_path, VoidCallable
from utils.adb_controller import ADB_BIN_PATH, ADB_SERVER_PORT
from utils.clipboard import Clipboard
from utils.logger import LOGGER, LogType
from utils.network import get_port

SERVER_PORT = get_port("scrcpy_port", 1234)
SERVER_EXECUTABLE_NAME = "scrcpy-server"

class InvalidDummyByteException(Exception): pass

def push_server(device: AdbDevice):
    target_path = "/data/local/tmp/scrcpy-server-manual.jar"
    script_path = script_abs_path(__file__)
    server_binary_path = Path.joinpath(script_path, SERVER_EXECUTABLE_NAME)
    device.sync.push(str(server_binary_path), target_path)

def server_process_factory() -> subprocess.Popen | Exception:
    command = "CLASSPATH=/data/local/tmp/scrcpy-server-manual.jar \
app_process / com.genymobile.scrcpy.Server 2.7 \
tunnel_forward=true video=false audio=false control=true \
cleanup=false raw_stream=true send_dummy_byte=true max_size=4096"
    try:
        process = subprocess.Popen(
            f"{ADB_BIN_PATH} -P {ADB_SERVER_PORT} shell {command}",
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            creationflags=subprocess.CREATE_NO_WINDOW,
        )
        output = process.stdout.readline() # type: ignore
    except Exception as e:
        LOGGER.write(LogType.Error, "Failed to start subprocess: " + str(e))
        return e
    LOGGER.write(LogType.Server, output)
    time.sleep(1)
    return process

def try_connect_server(host: str, port: int=SERVER_PORT) -> socket.socket | Exception:
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect((host, port))

    client_socket.settimeout(3)
    try:
        dummy = client_socket.recv(4)
        client_socket.settimeout(None)
    except socket.timeout as e: return e
    except Exception as e: return e

    LOGGER.write(LogType.Info, "dummy byte: " + str(dummy))
    if len(dummy) == 1 and dummy[0] == 0x00:
        return client_socket
    return InvalidDummyByteException()

# --- --- --- --- --- ---

class ReceivedClipboardText:
    lock = threading.Lock()
    text: str | None = None
    @staticmethod
    def read():
        with ReceivedClipboardText.lock:
            current_text = ReceivedClipboardText.text
        return current_text
    @staticmethod
    def write(new_text: str):
        with ReceivedClipboardText.lock:
            ReceivedClipboardText.text = new_text

def server_receiver_factory(client_socket: socket.socket) -> VoidCallable:
    from utils.config_manager import get_config

    def data_recv(client_socket: socket.socket) -> bool:
        data = client_socket.recv(4096)
        if len(data) > 0:
            text = GetClipboardEventResponse.deserialize(data)
            if text is None: return True

            # prevent duplicated clipboard content
            current_clipboard_text = Clipboard.safe_paste()
            if not get_config().sync_clipboard: return True
            if current_clipboard_text is not None and text != current_clipboard_text:
                Clipboard.safe_copy(text)
                ReceivedClipboardText.write(text)
            return True
        else:
            LOGGER.write(LogType.Server, "Scrcpy server closed connection.")
            return False

    def receiver(client_socket: socket.socket):
        while True:
            try:
                if not data_recv(client_socket): break
            except (ConnectionAbortedError, ConnectionResetError) as e:
                LOGGER.write(LogType.Error, "Connection error: " + str(e))
                break
            except Exception as e:
                LOGGER.write(LogType.Error, "Getting clipboard data error: " + str(e))
                break
        LOGGER.write(LogType.Server, "Scrcpy receiver stopped.")

    def stop_receiver():
        nonlocal client_socket, thread
        client_socket.close()
        thread.join()

    thread = threading.Thread(target=receiver, args=[client_socket])
    thread.start()
    return stop_receiver
