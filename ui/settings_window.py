import threading
import multiprocessing
import threading

from dataclasses import asdict
from PyQWebWindow import QAppManager, QWebWindow
from ui import ICON_ICO_PATH, SETTINGS_PAGE_PATH
from utils.config_manager import ConfigManager, get_config, get_config_manager
from utils.i18n import get_i18n

def settings_window_runner(result_queue: multiprocessing.Queue):
    i18n = get_i18n()

    def config() -> dict:
        config_ = get_config()
        return asdict(config_)

    def save_config(config: dict):
        nonlocal result_queue, window
        result_queue.put(config)
        window.close()

    def setting_finished_callback():
        nonlocal window
        window.close()

    app = QAppManager()
    window = QWebWindow(
        title=i18n(["InputShare Settings", "输入流转 —— 设置"]),
        icon=str(ICON_ICO_PATH.absolute()),
        size=(720, 400),
        minimum_size=(600, 360),
    )
    window.event_listener\
        .add_event_listener("window_close_requested", setting_finished_callback)
    window.register_bindings([
        config, save_config,
    ])
    window.load_file(str(SETTINGS_PAGE_PATH))
    window.start()
    app.exec()
    result_queue.put(None)

def open_settings_window() -> threading.Thread:
    def inner():
        result_queue = multiprocessing.Queue()
        window_process = multiprocessing.Process(
            target=settings_window_runner,
            args=[result_queue],
        )
        window_process.start()
        window_process.join()

        result: str | None = result_queue.get()
        if result is None: return
        new_config = ConfigManager.parse_config_json(result)
        get_config_manager().use_new_config(new_config)

    background_thread = threading.Thread(target=inner)
    background_thread.start()
    return background_thread
