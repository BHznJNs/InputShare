from dataclasses import dataclass

@dataclass
class ConnectResult:
    is_completed: bool
    is_wired_connection: bool
    connected_addr: str | None
    detect_port: bool

def connecting_window_runner(client: "IpcClient") -> "QWebWindow": # type: ignore
    import darkdetect
    from dataclasses import asdict
    from PyQWebWindow.all import QWebWindow, IpcClient

    from ui import CONNECT_PAGE_PATH, ICON_ICO_PATH
    from utils.adb_controller import AdbController
    from utils.config_manager import get_config, get_config_manager
    from utils.network import scan_port
    from utils.i18n import get_i18n
    from utils.logger import LOGGER, LogType
    assert isinstance(client, IpcClient)

    i18n = get_i18n()
    is_wired_connection = False
    is_connect_finished = False
    connected_addr = None
    detect_port = False

    def set_is_wired_connection():
        nonlocal is_wired_connection
        is_wired_connection = True
    
    def set_connect_success():
        nonlocal is_connect_finished
        is_connect_finished = True

    def is_first_use() -> bool:
        return get_config_manager().is_first_use

    def config() -> dict:
        return asdict(get_config())

    def try_connect(addr: str, detect_port_: bool) -> bool:
        nonlocal connected_addr, detect_port
        detect_port = detect_port_
        if not detect_port_:
            is_successful = AdbController.try_connect_device(addr)
            if is_successful:
                connected_addr = addr
            return is_successful

        target_ports = scan_port(addr)
        for port in target_ports:
            connect_addr = f"{addr}:{port}"
            is_successful = AdbController.try_connect_device(connect_addr)
            if is_successful:
                connected_addr = connect_addr
                return True
        LOGGER.write(LogType.Error, "Scanned ports: " + str(target_ports))
        return False

    def window_closed_callback():
        nonlocal window, is_connect_finished, is_wired_connection, connected_addr, detect_port
        client.emit("task-completed", ConnectResult(
            is_completed=is_connect_finished,
            is_wired_connection=is_wired_connection,
            connected_addr=connected_addr,
            detect_port=detect_port,
        )) # type: ignore

    window = QWebWindow(
        title=i18n(["InputShare Connection", "输入流转 —— 连接"]),
        icon=str(ICON_ICO_PATH.absolute()),
        size=(500, 320),
        minimum_size=(500, 320),
        background_color="#121212" if darkdetect.isDark() else "#FFFFFF")

    window.register_bindings([
        set_is_wired_connection,
        set_connect_success,
        is_first_use, config,
    ])
    window.register_tasks([AdbController.try_pairing, try_connect])
    window.event_listener\
          .add_event_listener("window_close_requested", lambda: window.close())
    window.event_listener\
          .add_event_listener("window_closed", window_closed_callback)
    window.load_file(str(CONNECT_PAGE_PATH))
    window.start()
    return window
