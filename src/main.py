from socket import socket
from ui.connecting_window import ConnectResult
from utils import VoidCallable

def try_connect() -> Exception | None:
    from utils.network.ip_check import get_ip_from_ip_port

    res = WindowManager.submit_and_wait(connecting_window_runner, ConnectResult)
    if not res.is_completed:
        # user closed the connect window
        AdbController.get_adb_client().server_kill()
        sys.exit(1)

    config = get_config()
    client = AdbController.get_adb_client()
    device_list = client.device_list()
    if res.is_wired_connection:
        if len(device_list) == 0:
            return AdbController.AdbWiredConnectionError()
        target_device = device_list[0]
        LOGGER.write(LogType.Info, f"Connected wired device: {target_device.serial}")
        AdbController.append_adb_device(device_list[0])
    else:
        if res.connected_addr is None or len(device_list) == 0:
            return AdbController.AdbWirelessConnectionError()
        for device in device_list:
            if device.serial != res.connected_addr: continue
            config.device_ip1 = get_ip_from_ip_port(res.connected_addr)
            config.detect_port = res.detect_port
            LOGGER.write(LogType.Info, f"Connected wireless device: {res.connected_addr}")
            AdbController.append_adb_device(device); break

def try_start_server() -> tuple[VoidCallable, socket] | Exception:
    def stop_server():
        stop_scrcpy_receiver()
        if stop_reporter_receiver: stop_reporter_receiver()
        scrcpy_server_process.terminate()

    res = deploy_scrcpy_server()
    if isinstance(res, Exception): return res
    scrcpy_server_process, scrcpy_client_socket = res

    stop_scrcpy_receiver = scrcpy_receiver.server_receiver_factory(scrcpy_client_socket)
    stop_reporter_receiver: VoidCallable | None = None

    if get_config().edge_toggling:
        res = deploy_reporter_server()
        if isinstance(res, Exception): return res
        stop_reporter_receiver = reporter_receiver.server_receiver_factory()
    return stop_server, scrcpy_client_socket

def close_notification_resolver(errno: Exception | None):
    from socket import timeout as SocketTimeoutError
    from adbutils import AdbInstallError
    from utils.i18n import get_i18n
    from utils.notification import Notification, send_notification

    close_notification = None
    i18n = get_i18n()
    match errno:
        case None: pass
        case AdbController.AdbWiredConnectionError():
            close_notification = Notification(
                i18n(["ConnectionError", "连接错误"]),
                i18n(["Wired connection failed, please check if the device is connected correctly.", "有线连接失败，请检查是否正确连接设备。"]))
        case AdbController.AdbWirelessConnectionError():
            close_notification = Notification(
                i18n(["ConnectionError", "连接错误"]),
                i18n(["Wireless connection failed, this may be an internal error, please report it to help us fix it.", "无线连接失败，这可能是一个内部错误，请报告以帮助我们修复它。"]))

        case scrcpy_receiver.InvalidDummyByteException():
            close_notification = Notification(
                i18n(["NetworkError", "网络错误"]),
                i18n(["Connection with device failed, please retry.", "设备连接失败，请重试。"]))
        case AdbInstallError():
            close_notification = Notification(
                i18n(["NetworkError", "网络错误"]),
                i18n(["Android client installation failed, please retry.", "安卓客户端安装失败，请重试。"]))
        case SocketTimeoutError() | TimeoutError():
            close_notification = Notification(
                i18n(["NetworkError", "网络错误"]),
                i18n(["Connection with device timeout, please retry.", "设备连接超时，请重试。"]))
        case ConnectionAbortedError() | ConnectionResetError():
            close_notification = Notification(
                i18n(["NetworkError", "网络错误"]),
                i18n(["Unexpected connection aborted.", "连接意外中断。"]))
        case _:
            error_name = errno.__class__.__name__
            close_notification = Notification(
                i18n(["Error", "错误"]),
                i18n([f"Unknown error: {error_name}", f"未知错误：{error_name}"]))
    AdbController.get_adb_client().server_kill()
    LOGGER.write(LogType.Adb, "ADB server killed.")
    LOGGER.write(LogType.Info, "Program terminated with: " + str(close_notification))
    send_notification(close_notification)

if __name__ == "__main__":
    from multiprocessing import freeze_support
    from ui.window_manager import WindowManager
    freeze_support()
    WindowManager.init()

    import sys
    from server import deploy_reporter_server, deploy_scrcpy_server, scrcpy_receiver, reporter_receiver
    from input.callbacks import callback_context_wrapper
    from ui.connecting_window import connecting_window_runner
    from ui.tray import start_system_tray
    from utils.adb_controller import AdbController
    from utils.config_manager import get_config
    from utils.logger import LogType, LOGGER

    AdbController.start_adb_server()
    res = try_connect()
    if isinstance(res, Exception):
        close_notification_resolver(res)
        sys.exit(1)

    res = try_start_server()
    if isinstance(res, Exception):
        close_notification_resolver(res)
        sys.exit(1)
    stop_server, scrcpy_client_socket = res

    close_tray = start_system_tray(scrcpy_client_socket)
    callbacks  = callback_context_wrapper(scrcpy_client_socket)

    from input.controller import main_loop
    main_errno = main_loop(*callbacks)

    LOGGER.write(LogType.Info, "Terminated, closing...")
    stop_server()
    close_tray()
    close_notification_resolver(main_errno)
    WindowManager.shutdown()
