import socket
import sys
from typing import Callable

from adbutils import AdbInstallError
from multiprocessing import freeze_support
from server import deploy_reporter_server, deploy_scrcpy_server, ADBConnectionError, scrcpy_receiver, reporter_receiver
from input.callbacks import callback_context_wrapper
from ui.connecting_window import open_connecting_window
from ui.tray import tray_thread_factory
from utils.adb_controller import append_adb_device, get_adb_client, start_adb_server
from utils.config_manager import get_config
from utils.i18n import get_i18n
from utils.logger import LogType, LOGGER
from utils.notification import Notification, send_notification

def close_notification_resolver(errno: Exception | None):
    close_notification = None
    i18n = get_i18n()
    match errno:
        case None: pass
        case ADBConnectionError():
            close_notification = Notification(
                i18n(["ConnectionError", "连接错误"]),
                i18n(["Wired connection failed, please check if the device is connected correctly.", "有线连接失败，请检查是否正确连接设备。"]))
        case scrcpy_receiver.InvalidDummyByteException():
            close_notification = Notification(
                i18n(["NetworkError", "网络错误"]),
                i18n(["Connection with device failed, please retry.", "设备连接失败，请重试。"]))
        case AdbInstallError():
            close_notification = Notification(
                i18n(["NetworkError", "网络错误"]),
                i18n(["Android client installation failed, please retry.", "安卓客户端安装失败，请重试。"]))
        case socket.timeout | TimeoutError():
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
    get_adb_client().server_kill()
    LOGGER.write(LogType.Adb, "ADB server killed.")
    LOGGER.write(LogType.Info, "Program terminated with: " + str(close_notification))
    send_notification(close_notification)

if __name__ == "__main__":
    freeze_support()

    start_adb_server()
    is_wired_connection = open_connecting_window()
    if is_wired_connection:
        device_list = get_adb_client().device_list()
        if len(device_list) == 0:
            # selected wired connection
            close_notification_resolver(ADBConnectionError())
            sys.exit(1)
        append_adb_device(device_list[0])

    res = deploy_scrcpy_server()
    if isinstance(res, Exception):
        close_notification_resolver(res)
        sys.exit(1)
    scrcpy_server_process, scrcpy_client_socket = res

    stop_scrcpy_receiver = scrcpy_receiver.server_receiver_factory(scrcpy_client_socket)
    stop_reporter_receiver: Callable | None = None

    if get_config().edge_toggling:
        res = deploy_reporter_server()
        if isinstance(res, Exception):
            close_notification_resolver(res)
            sys.exit(1)
        stop_reporter_receiver = reporter_receiver.server_receiver_factory()

    close_tray = tray_thread_factory(scrcpy_client_socket)
    callbacks  = callback_context_wrapper(scrcpy_client_socket)

    from input.controller import main_loop
    main_errno = main_loop(*callbacks)

    LOGGER.write(LogType.Info, "Terminated, closing...")
    stop_scrcpy_receiver()
    stop_reporter_receiver and stop_reporter_receiver() # type: ignore
    scrcpy_server_process.terminate()

    close_notification_resolver(main_errno)
    close_tray()
