def settings_window_runner(client: "IpcClient", current_config: dict): # type: ignore
    import darkdetect
    from PyQWebWindow.all import QWebWindow
    from ui import ICON_ICO_PATH, SETTINGS_PAGE_PATH
    from utils.i18n import get_i18n

    i18n = get_i18n()
    new_config = None

    def config() -> dict:
        return current_config

    def save_config(config: dict):
        nonlocal new_config
        new_config = config

    def setting_finished_callback():
        nonlocal window, new_config
        window.close()
        client.emit("task-completed", new_config)

    window = QWebWindow(
        title=i18n(["InputShare Settings", "输入流转 —— 设置"]),
        icon=str(ICON_ICO_PATH.absolute()),
        size=(720, 400),
        minimum_size=(600, 360),
        background_color="#121212" if darkdetect.isDark() else "#FFFFFF")
    window.event_listener\
          .add_event_listener("window_close_requested", setting_finished_callback)

    window.load_file(str(SETTINGS_PAGE_PATH))
    window.register_bindings([config, save_config])
    window.start()
    return new_config
