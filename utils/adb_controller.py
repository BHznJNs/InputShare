import re
import os
import sys
import subprocess
import adbutils

from pathlib import Path
from utils import script_abs_path
from utils.logger import LogType, LOGGER

script_path = script_abs_path(__file__).parent
adb_relative_path = "adb-bin/adb.exe"
adb_bin_path = Path.joinpath(script_path, adb_relative_path)
__adb_client_instance: adbutils.AdbClient | None = None
__adb_device_list: list[adbutils.AdbDevice] = []
os.environ["ADBUTILS_ADB_PATH"] = str(adb_bin_path)
ADB_BIN_PATH = str(adb_bin_path)
ADB_SERVER_PORT = 5038

class ADBWiredConnectionError(Exception): pass

def get_adb_client() -> adbutils.AdbClient:
    global __adb_client_instance
    if __adb_client_instance is None:
        # use non-default port to prevent conflict with Android Studio
        __adb_client_instance = adbutils.AdbClient(port=ADB_SERVER_PORT)
    return __adb_client_instance

def get_adb_device(device_index: int = 0) -> adbutils.AdbDevice | Exception:
    if len(__adb_device_list) == 0:
        return ADBWiredConnectionError()
    target_device = __adb_device_list[device_index]
    LOGGER.write(LogType.Adb, "Selected device: " + str(target_device))
    return target_device

def append_adb_device(device: adbutils.AdbDevice):
    __adb_device_list.append(device)

def start_adb_server():
    command = f"{ADB_BIN_PATH} -P {ADB_SERVER_PORT} start-server"
    process = subprocess.Popen(
        command,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    process.wait()
    stdout, stderr = process.communicate()
    if not stdout and not stderr:
        LOGGER.write(LogType.Adb, "ADB server is running.")
    else: # adb server to be started
        LOGGER.write(LogType.Adb, "start-server output: \n" + stderr)

def try_pairing(addr: str, pairing_code: str, timeout=3.0) -> bool:
    command = f"{ADB_BIN_PATH} -P {ADB_SERVER_PORT} pair {addr} {pairing_code}"
    try:
        process = subprocess.Popen(
            command,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
        process.wait(timeout)
        stdout, stderr = process.communicate()
        if stderr: raise Exception(stderr)
        LOGGER.write(LogType.Adb, "Adb pairing output: " + stdout)
        return True
    except Exception as e:
        process.terminate()
        LOGGER.write(LogType.Error, "ADB failed to pair: " + str(e))
        return False

def try_connect_device(addr: str, timeout: float=3.0) -> adbutils.AdbClient | None:
    client = get_adb_client()
    try:
        output = client.connect(addr, timeout)
        assert len(client.device_list()) > 0
        for device in client.iter_device():
            if device.serial == addr:
                append_adb_device(device)
                break
        LOGGER.write(LogType.Adb, output)
        if output.startswith("failed"): return None
    except adbutils.AdbTimeout as e:
        client.disconnect(addr)
        LOGGER.write(LogType.Error, "Connect timeout: " + str(e))
        return None
    except Exception as e:
        client.disconnect(addr)
        LOGGER.write(LogType.Error, "Connect failed: " + str(e))
        return None
    return client

def get_display_size(adb_client: adbutils.AdbClient) -> tuple[int, int]:
    device = adb_client.device_list()[0]
    output = str(device.shell("dumpsys window displays"))

    size_pattern = re.compile(r'cur=\d+x\d+')
    size_match = size_pattern.search(output)

    if size_match is None:
        LOGGER.write(LogType.Error, "Get device size failed.")
        sys.exit(1)
    size = size_match.group(0).split('=')[1]
    width, height = map(int, size.split('x'))
    return (width, height)
