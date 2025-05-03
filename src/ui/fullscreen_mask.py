import threading
import tkinter as tk
import darkdetect

from utils import VoidCallable, screen_size
from utils.i18n import get_i18n
from utils.logger import LogType, LOGGER

show_event = threading.Event()
hide_event = threading.Event()
exit_event = threading.Event()

screen_width, screen_height = screen_size()

def interrupt(root: tk.Tk, toplevel: tk.Toplevel, label1: tk.Label, label2: tk.Label):
    def show_window(root: tk.Tk, toplevel: tk.Toplevel):
        root.deiconify()
        root.focus_force()
        toplevel.deiconify()
        toplevel.lift()
    def hide_window(root: tk.Tk, toplevel: tk.Toplevel):
        toplevel.withdraw()
        root.withdraw()

    # check event
    if show_event.is_set():
        show_window(root, toplevel)
        show_event.clear()
    elif hide_event.is_set():
        hide_window(root, toplevel)
        hide_event.clear()
    elif exit_event.is_set():
        LOGGER.write(LogType.Info, "Fullscreen mask exited.")
        root.quit()
    
    if darkdetect.isDark():
        toplevel.config(bg="#161616")
        label1.config(fg="#fff", bg="#161616")
        label2.config(fg="#fff", bg="#161616")
    else:
        toplevel.config(bg="#f7f7f7")
        label1.config(fg="#333333", bg="#f7f7f7")
        label2.config(fg="#333333", bg="#f7f7f7")

    interval_ms = 2 # 500 times per second
    root.after(interval_ms, interrupt, root, toplevel, label1, label2)

def open_mask_window():
    i18n = get_i18n()
    root = tk.Tk()
    root.wm_title(i18n(["InputShare Mask", "输入流转 —— 蒙版"]))
    root.wm_attributes("-alpha", 0.01)
    root.wm_attributes("-topmost", True)
    root.wm_attributes("-fullscreen", True)
    root.configure(cursor="none")
    root.overrideredirect(True)
    root.geometry(f"{screen_width}x{screen_height}")

    larger_font = i18n([
        ("Arial", 16),
        ("Microsoft YaHei", 16),
    ])

    label_toplevel = tk.Toplevel(master=root)
    label_toplevel.geometry("+20+20")
    label_toplevel.wm_title(i18n(["InputShare Shortcuts", "输入流转 —— 快捷键提示"]))
    label_toplevel.wm_attributes('-alpha', 0.6)
    label_toplevel.wm_attributes("-topmost", True)
    label_toplevel.overrideredirect(True)
    label_toplevel.configure(cursor="none")

    label1 = tk.Label(
        master=label_toplevel,
        text=i18n(["Use <Ctrl>+<Alt>+q to quit", "使用 <Ctrl>+<Alt>+q 退出程序"]),
        font=larger_font,
    )
    label2 = tk.Label(
        master=label_toplevel,
        text=i18n(["Use <Ctrl>+<Alt>+s to toggle", "使用 <Ctrl>+<Alt>+s 切换控制"]),
        font=larger_font,
    )
    label1.pack(padx=8, pady=4, anchor="w")
    label2.pack(padx=8, pady=4, anchor="w")

    root.after(0, interrupt, root, label_toplevel, label1, label2)
    root.mainloop()

def mask_thread_factory() -> tuple[
    VoidCallable, VoidCallable, VoidCallable,
]:
    def show_mask(): show_event.set()
    def hide_mask(): hide_event.set()
    def exit_mask(): exit_event.set()

    mask_thread = threading.Thread(target=open_mask_window)
    mask_thread.start()
    return show_mask, hide_mask, exit_mask
