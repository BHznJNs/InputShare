import sys
from dataclasses import asdict
from PyQWebWindow import QAppManager, QWebWindow

from ui import CONNECT_PAGE_PATH, ICON_ICO_PATH
from utils.adb_controller import get_adb_client, try_connect_device, try_pairing
from utils.config_manager import get_config, get_config_manager
from utils.logger import LOGGER, LogType
from utils.network import get_ip_from_ip_port, scan_port
from utils.i18n import get_i18n

i18n = get_i18n()
config = get_config()

def open_connecting_window() -> bool:
    is_wired_connection = False
    def set_is_wired_connection():
        nonlocal is_wired_connection
        is_wired_connection = True
    
    def is_first_use() -> bool:
        return get_config_manager().is_first_use

    def config() -> dict:
        global config
        return asdict(config)

    def try_connect(addr: str, detect_port: bool) -> bool:
        global config
        config.scan_port = detect_port
        if not detect_port:
            ret = try_connect_device(addr)
            is_successful = ret is not None
            if is_successful:
                config.device_ip1 = get_ip_from_ip_port(addr)
            return is_successful

        target_ports = scan_port(addr)
        for port in target_ports:
            connect_addr = f"{addr}:{port}"
            ret = try_connect_device(connect_addr)
            if ret is not None:
                config.device_ip1 = addr
                return True
        LOGGER.write(LogType.Error, "Scanned ports: " + str(target_ports))
        return False

    def close_window_callback():
        get_adb_client().server_kill()
        LOGGER.write(LogType.Adb, "ADB server killed.")
        sys.exit(0)
    
    def connect_finished_callback():
        nonlocal window
        window.close()

    app = QAppManager(debugging=True)
    window = QWebWindow(
        title=i18n(["InputShare Connection", "输入流转 —— 连接"]),
        icon=str(ICON_ICO_PATH.absolute()),
        size=(500, 320),
        minimum_size=(500, 320))
    window.register_bindings([
        set_is_wired_connection,
        is_first_use, config,
        try_pairing, try_connect,
    ])
    window.event_listener\
          .add_event_listener("window_closed", close_window_callback)
    window.event_listener\
          .add_event_listener("window_close_requested", connect_finished_callback)
    window.load_file(str(CONNECT_PAGE_PATH))
    window.start()
    app.exec()
    return is_wired_connection
