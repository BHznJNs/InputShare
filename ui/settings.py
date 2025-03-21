import gc
import threading
import customtkinter as ctk

from server.reporter_receiver import DevicePosition
from ui import ICON_ICO_PATH
from utils.config_manager import get_config
from utils.i18n import get_i18n, ENGLISH_LANGUAGE, CHINESE_LANGUAGE

settings_window: ctk.CTk | None = None
show_window_event = threading.Event()

def check_event():
    global settings_window
    if settings_window is None: return
    if show_window_event.is_set():
        settings_window.deiconify()
        settings_window.focus()
        show_window_event.clear()
    settings_window.after(func=check_event, ms=int(1000 / 30))

def mount_elements(root: ctk.CTk):
    def mouse_theme_section():
        nonlocal settings_scroll_frame, smaller_font, normal_font, larger_font, theme_var
        theme_frame = ctk.CTkFrame(master=settings_scroll_frame)
        theme_label = ctk.CTkLabel(
            master=theme_frame,
            font=larger_font,
            text=i18n(["Theme: ", "界面主题："]))
        system_radio = ctk.CTkRadioButton(
            master=theme_frame,
            text=i18n(["System", "跟随系统"]),
            font=normal_font,
            variable=theme_var, value="system")
        dark_radio = ctk.CTkRadioButton(
            master=theme_frame,
            text=i18n(["Dark theme", "夜间模式"]),
            font=normal_font,
            variable=theme_var, value="dark")
        light_radio = ctk.CTkRadioButton(
            master=theme_frame,
            text=i18n(["Light theme", "日间模式"]),
            font=normal_font,
            variable=theme_var, value="light")
        theme_frame.pack(fill="x", pady=(20, 0))
        theme_label.grid(row=0, padx=20, pady=(0, 6), sticky="w")
        system_radio.grid(row=1, padx=20, pady=4, sticky="w")
        dark_radio.grid(row=2, padx=20, pady=4, sticky="w")
        light_radio.grid(row=3, padx=20, pady=4, sticky="w")

    def mount_speed_section():
        nonlocal settings_scroll_frame, smaller_font, normal_font, larger_font, speed_var
        speed_frame = ctk.CTkFrame(master=settings_scroll_frame)
        speed_label = ctk.CTkLabel(
            master=speed_frame,
            font=larger_font,
            anchor="w",
            text=i18n(["Mouse speed: ", "鼠标移动速度："]))
        info_label = ctk.CTkLabel(
            master=speed_frame,
            font=smaller_font,
            anchor="w",
            text=i18n(["Mouse movement speed in your Android device.",
                       "鼠标在你的安卓设备上的移动速度。"]))
        speed_slider_frame = ctk.CTkFrame(master=speed_frame)
        low_label = ctk.CTkLabel(
            master=speed_slider_frame,
            text=i18n(["low", "低"]),
            font=smaller_font)
        high_label = ctk.CTkLabel(
            master=speed_slider_frame,
            text=i18n(["high", "高"]),
            font=smaller_font)
        speed_slider = ctk.CTkSlider(
            master=speed_slider_frame,
            from_=1, to=6,
            variable=speed_var,
            number_of_steps=25)
        speed_frame.pack(fill="x", pady=(20, 0))
        speed_label.pack(fill="x", padx=20)
        info_label.pack(fill="x", padx=20)
        speed_slider_frame.pack(fill="x", padx=(16, 16), pady=4)
        low_label.pack(side=ctk.LEFT, padx=(20, 0))
        speed_slider.pack(side=ctk.LEFT, expand=True)
        high_label.pack(side=ctk.LEFT, padx=(0, 20))
    
    def edge_toggling_section():
        nonlocal settings_scroll_frame, smaller_font, normal_font, larger_font,\
                 edge_toggling_var, device_position_var
        edge_toggling_frame = ctk.CTkFrame(master=settings_scroll_frame)
        edge_toggling_label = ctk.CTkLabel(
            master=edge_toggling_frame,
            font=larger_font,
            text=i18n(["Edge Toggling: ", "贴边切换："]))
        edge_toggling_checkbox = ctk.CTkCheckBox(
            master=edge_toggling_frame,
            text="",
            variable=edge_toggling_var)
        edge_toggling_info_label = ctk.CTkLabel(
            master=edge_toggling_frame,
            font=smaller_font,
            text=i18n(["When enabled, the control will be toggled when the mouse reaches the screen edge.",
                       "启用后，当鼠标移至屏幕边缘时会自动切换控制。"]))
        
        device_position_label = ctk.CTkLabel(
            master=edge_toggling_frame,
            font=larger_font,
            text=i18n(["Device Position: ", "设备位置："]))
        device_position_left_radio = ctk.CTkRadioButton(
            master=edge_toggling_frame,
            font=normal_font,
            text=i18n(["Left side", "电脑左侧"]),
            variable=device_position_var, value=DevicePosition.LEFT)
        device_position_right_radio = ctk.CTkRadioButton(
            master=edge_toggling_frame,
            font=normal_font,
            text=i18n(["Right side", "电脑右侧"]),
            variable=device_position_var, value=DevicePosition.RIGHT)
        device_position_top_radio = ctk.CTkRadioButton(
            master=edge_toggling_frame,
            font=normal_font,
            text=i18n(["Top side", "电脑上方"]),
            variable=device_position_var, value=DevicePosition.TOP)
        device_position_bottom_radio = ctk.CTkRadioButton(
            master=edge_toggling_frame,
            font=normal_font,
            text=i18n(["Bottom side", "电脑下方"]),
            variable=device_position_var, value=DevicePosition.BOTTOM)
        
        validate_entry = lambda text: len(text) == 0 or text.isdigit()
        vcmd = (edge_toggling_frame.register(validate_entry), "%P")
        trigger_margin_label = ctk.CTkLabel(
            master=edge_toggling_frame,
            font=larger_font,
            text=i18n(["Trigger Margin: ", "触发边距："]))
        trigger_margin_entry = ctk.CTkEntry(
            master=edge_toggling_frame,
            font=normal_font,
            textvariable=trigger_margin_var,
            validate="key",
            validatecommand=vcmd)
        trigger_margin_info_label = ctk.CTkLabel(
            master=edge_toggling_frame,
            font=smaller_font,
            text=i18n(["Prevents triggers when the mouse reaches the corners. Larger values reduce accidents.",
                       "避免鼠标触及屏幕角落时触发切换。更大的值可以避免误操作。"]))

        edge_toggling_frame.pack(fill="x", pady=(20, 0))
        edge_toggling_label.grid(row=0, column=0, padx=(20, 0), sticky="w")
        edge_toggling_checkbox.grid(row=0, column=1, sticky="w")
        edge_toggling_info_label.grid(row=1, column=0, columnspan=2, padx=20, sticky="w")

        device_position_label.grid(row=2, column=0, padx=(20, 0), pady=(6, 0), sticky="w")
        device_position_left_radio.grid(row=3, padx=20, pady=4, sticky="w")
        device_position_right_radio.grid(row=4, padx=20, pady=4, sticky="w")
        device_position_top_radio.grid(row=5, padx=20, pady=4, sticky="w")
        device_position_bottom_radio.grid(row=6, padx=20, pady=4, sticky="w")

        trigger_margin_label.grid(row=7, column=0, padx=(20, 0), pady=(6, 0), sticky="w")
        trigger_margin_entry.grid(row=7, column=1, pady=(6, 0), sticky="w")
        trigger_margin_info_label.grid(row=8, column=0, columnspan=2, padx=20, sticky="w")

    def keep_wakeup_section():
        nonlocal settings_scroll_frame, smaller_font, normal_font, larger_font, keep_wakeup_var
        keep_wakeup_frame = ctk.CTkFrame(master=settings_scroll_frame)
        keep_wakeup_label = ctk.CTkLabel(
            master=keep_wakeup_frame,
            font=larger_font,
            text=i18n(["Keep Screen On: ", "保持设备屏幕常亮："]))
        check_box = ctk.CTkCheckBox(
            master=keep_wakeup_frame,
            text="",
            variable=keep_wakeup_var)
        info_label = ctk.CTkLabel(
            master=keep_wakeup_frame,
            font=smaller_font,
            text=i18n(["When enabled, the Android device screen will stay on and prevent auto-sleep.",
                       "启用后，安卓设备屏幕将持续亮屏，防止自动休眠。"]))
        keep_wakeup_frame.pack(fill="x", pady=(20, 0))
        keep_wakeup_label.grid(row=0, column=0, padx=(20, 0), sticky="w")
        check_box.grid(row=0, column=1)
        info_label.grid(row=1, column=0, columnspan=2, padx=20)

    def mount_language_section():
        nonlocal settings_scroll_frame, smaller_font, normal_font, larger_font, language_var
        language_frame = ctk.CTkFrame(master=settings_scroll_frame)
        language_label = ctk.CTkLabel(
            master=language_frame,
            font=larger_font,
            text=i18n(["Language: ", "语言："]))
        chinese_radio = ctk.CTkRadioButton(
            master=language_frame,
            text="简体中文",
            font=ctk.CTkFont(family="Microsoft YaHei", size=16),
            variable=language_var, value=CHINESE_LANGUAGE)
        english_radio = ctk.CTkRadioButton(
            master=language_frame,
            text="English",
            font=ctk.CTkFont(family="Arial", size=16),
            variable=language_var, value=ENGLISH_LANGUAGE)
        language_frame.pack(fill="x", pady=(20, 20))
        language_label.grid(row=0, padx=20, pady=(0, 6), sticky="w")
        chinese_radio.grid(row=1, padx=20, pady=4, sticky="w")
        english_radio.grid(row=2, padx=20, pady=4, sticky="w")

    def cancel():
        nonlocal root
        root.destroy()

    def confirm():
        nonlocal root, config, theme_var, speed_var, language_var
        config.theme           = theme_var.get()
        config.mouse_speed     = speed_var.get()
        config.edge_toggling   = edge_toggling_var.get()
        config.device_position = device_position_var.get()
        config.trigger_margin  = int(trigger_margin_var.get())
        config.keep_wakeup     = keep_wakeup_var.get()
        config.language        = language_var.get()
        root.destroy()

    i18n   = get_i18n()
    config = get_config()
    smaller_font = i18n([ctk.CTkFont(family="Arial", size=12), ctk.CTkFont(family="Microsoft YaHei", size=12)])
    normal_font  = i18n([ctk.CTkFont(family="Arial", size=16), ctk.CTkFont(family="Microsoft YaHei", size=16)])
    larger_font  = i18n([ctk.CTkFont(family="Arial", size=18), ctk.CTkFont(family="Microsoft YaHei", size=18)])

    settings_scroll_frame = ctk.CTkScrollableFrame(master=root, height=320)
    settings_scroll_frame.pack(fill="x", expand=True)
    theme_var           = ctk.StringVar (master=settings_scroll_frame, value=config.theme)
    speed_var           = ctk.DoubleVar (master=settings_scroll_frame, value=config.mouse_speed)
    edge_toggling_var   = ctk.BooleanVar(master=settings_scroll_frame, value=config.edge_toggling)
    device_position_var = ctk.StringVar (master=settings_scroll_frame, value=config.device_position)
    trigger_margin_var  = ctk.StringVar (master=settings_scroll_frame, value=str(config.trigger_margin))
    keep_wakeup_var     = ctk.BooleanVar(master=settings_scroll_frame, value=config.keep_wakeup)
    language_var        = ctk.StringVar (master=settings_scroll_frame, value=i18n([ENGLISH_LANGUAGE, CHINESE_LANGUAGE]))

    mouse_theme_section()
    mount_speed_section()
    edge_toggling_section()
    keep_wakeup_section()
    mount_language_section()

    # action buttons section
    button_frame = ctk.CTkFrame(master=root)
    tips_label = ctk.CTkLabel(
        master=button_frame,
        text=i18n(["Some settings require a restart to take effect.",
                   "部分设置需要重启应用后生效。"]),
        anchor="e",
        font=smaller_font)
    cancel_button = ctk.CTkButton(
        master=button_frame,
        text=i18n(["Cancel", "取消"]),
        font=normal_font,
        command=cancel)
    confirm_button = ctk.CTkButton(
        master=button_frame,
        text=i18n(["Confirm", "确定"]),
        font=normal_font,
        command=confirm)
    button_frame.pack(fill="x")
    tips_label.pack(fill="x", padx=8, pady=(4, 4), expand=True)
    confirm_button.pack(padx=4, pady=(0, 10), side=ctk.RIGHT)
    cancel_button.pack(padx=4, pady=(0, 10), side=ctk.RIGHT)

def start_settings_window():
    global settings_window

    settings_window = ctk.CTk()
    settings_window.iconbitmap(ICON_ICO_PATH)
    settings_window.wm_title(get_i18n()(["InputShare Settings", "输入流转 —— 设置"]))
    settings_window.geometry("400x440")
    settings_window.minsize(400, 440)

    mount_elements(settings_window)
    settings_window.after(0, func=check_event)
    settings_window.mainloop()
    settings_window = None

    # manually do the GC,
    # prevent the automatical GC after this child thread closed
    # from causing errors with the tk variable
    gc.collect()

def open_settings_window():
    global settings_window, show_window_event
    if settings_window is not None:
        show_window_event.set()
        return
    thread = threading.Thread(target=start_settings_window)
    thread.start()
    return thread
