import threading
import customtkinter as ctk

from utils import VoidCallable, screen_size
from utils.i18n import get_i18n
from utils.logger import LogType, LOGGER

show_event = threading.Event()
hide_event = threading.Event()
exit_event = threading.Event()

screen_width, screen_height = screen_size()

def check_event(root: ctk.CTk, toplevel: ctk.CTkToplevel):
    def show_window(root: ctk.CTk, toplevel: ctk.CTkToplevel):
        root.deiconify()
        root.focus_force()
        toplevel.deiconify()
        toplevel.lift()
    def hide_window(root: ctk.CTk, toplevel: ctk.CTkToplevel):
        toplevel.withdraw()
        root.withdraw()

    if show_event.is_set():
        show_window(root, toplevel)
        show_event.clear()
    elif hide_event.is_set():
        hide_window(root, toplevel)
        hide_event.clear()
    elif exit_event.is_set():
        LOGGER.write(LogType.Info, "Fullscreen mask exited.")
        root.quit()

    interval_ms = 2 # 500 times per second
    root.after(interval_ms, check_event, root, toplevel)

def open_mask_window():
    i18n = get_i18n()
    root = ctk.CTk()
    root.wm_title(i18n(["InputShare Mask", "输入流转 —— 蒙版"]))
    root.wm_attributes("-alpha", 0.01)
    root.wm_attributes("-topmost", True)
    root.wm_attributes("-fullscreen", True)
    root.configure(cursor="none")
    root.overrideredirect(True)
    root.geometry(f"{screen_width}x{screen_height}")

    larger_font = i18n([
        ctk.CTkFont(family="Arial", size=18),
        ctk.CTkFont(family="Microsoft YaHei", size=18),
    ])

    label_toplevel = ctk.CTkToplevel(master=root)
    label_toplevel.geometry("+20+20")
    label_toplevel.wm_title(i18n(["InputShare Shortcuts", "输入流转 —— 快捷键提示"]))
    label_toplevel.wm_attributes('-alpha', 0.6)
    label_toplevel.wm_attributes("-topmost", True)
    label_toplevel.overrideredirect(True)
    label_toplevel.configure(cursor="none")

    label1 = ctk.CTkLabel(
        master=label_toplevel,
        text=i18n(["Use <Ctrl>+<Alt>+q to quit", "使用 <Ctrl>+<Alt>+q 退出程序"]),
        font=larger_font,
    )
    label2 = ctk.CTkLabel(
        master=label_toplevel,
        text=i18n(["Use <Ctrl>+<Alt>+s to toggle", "使用 <Ctrl>+<Alt>+s 切换控制"]),
        font=larger_font,
    )
    label1.pack(padx=4, pady=4)
    label2.pack(padx=4, pady=4)

    root.after(0, check_event, root, label_toplevel)
    root.mainloop()

def mask_thread_factory() -> tuple[
    VoidCallable, VoidCallable, VoidCallable,
]:
    def show_mask():
        show_event.set()
    def hide_mask():
        hide_event.set()
    def exit_mask():
        exit_event.set()

    mask_thread = threading.Thread(target=open_mask_window)
    mask_thread.start()
    return show_mask, hide_mask, exit_mask
