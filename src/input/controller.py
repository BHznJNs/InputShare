import threading
import time
from pynput import keyboard, mouse
from input import EXIT_KEY_COMBINATION, SWITCH_KEY_COMBINATION
from scrcpy_client.clipboard_event import GetClipboardEvent, SetClipboardEvent
from scrcpy_client.hid_event import KeyEmptyEvent
from input.callbacks import KeyEventCallback,\
    MouseClickCallback, MouseMoveCallback, MouseScrollCallback,\
    SendDataCallback, SendDataAsyncCallback
from input.edge_portal import edge_portal_thread_factory
from server.scrcpy_receiver import ReceivedClipboardText
from ui.fullscreen_mask import mask_thread_factory
from utils.clipboard import Clipboard
from utils.config_manager import get_config
from utils.logger import LOGGER, LogType

is_redirecting = False
keyboard_controller = keyboard.Controller()
toggle_event = threading.Event()
exit_event = threading.Event()
main_errno: Exception | None = None

last_toggling_time  = time.perf_counter()
DEBOUNCING_DURATION = 0.25
def schedule_toggle(force: bool | None = None):
    global toggle_event, is_redirecting, last_toggling_time
    current_time = time.perf_counter()
    if current_time - last_toggling_time < DEBOUNCING_DURATION:
        LOGGER.write(LogType.Info, "Toggling debounced."); return
    last_toggling_time = current_time

    if force is None:
        # triggered by hotkey
        keyboard_controller.release(keyboard.Key.ctrl)
        keyboard_controller.release(keyboard.Key.alt)
    is_redirecting = force if force is not None else not is_redirecting
    toggle_event.set()

def schedule_exit(errno: Exception | None = None):
    global exit_event, main_errno
    if errno is not None:
        main_errno = errno
    schedule_toggle()
    exit_event.set()

switch_hotkey = keyboard.HotKey(keyboard.HotKey.parse(SWITCH_KEY_COMBINATION), schedule_toggle)
exit_hotkey = keyboard.HotKey(keyboard.HotKey.parse(EXIT_KEY_COMBINATION), schedule_exit)

def keyboard_press_handler_factory(callback: KeyEventCallback):
    def keyboard_press_handler(k: keyboard.Key | keyboard.KeyCode | None):
        global is_redirecting, keyboard_listener
        assert keyboard_listener is not None
        if k is None: return

        canonical_k = keyboard_listener.canonical(k)
        switch_hotkey.press(canonical_k)
        exit_hotkey.press(canonical_k)
        callback(canonical_k, is_redirecting)
    return keyboard_press_handler

def keyboard_release_handler_factory(callback: KeyEventCallback):
    def keyboard_release_handler(k: keyboard.Key | keyboard.KeyCode | None):
        global is_redirecting, keyboard_listener
        assert keyboard_listener is not None
        if k is None: return

        canonical_k = keyboard_listener.canonical(k)
        switch_hotkey.release(canonical_k)
        exit_hotkey.release(canonical_k)
        callback(canonical_k, is_redirecting)
    return keyboard_release_handler

def mouse_move_handler_factory(callback: MouseMoveCallback):
    def mouse_move_handler(x: int, y: int):
        global is_redirecting
        callback(x, y, is_redirecting)
    return mouse_move_handler

def mouse_click_handler_factory(callback: MouseClickCallback):
    def mouse_click_handler(x: int, y: int, button: mouse.Button, pressed: bool):
        global is_redirecting, main_errno
        callback(x, y, button, pressed, is_redirecting)
    return mouse_click_handler

def mouse_scroll_handler_factory(callback: MouseScrollCallback):
    def mouse_scroll_handler(x: int, y: int, dx: int, dy: int):
        global is_redirecting, main_errno
        callback(x, y, dx, dy, is_redirecting)
    return mouse_scroll_handler

def main_loop(
    send_data: SendDataCallback,
    send_data_async: SendDataAsyncCallback,
    keyboard_press_callback: KeyEventCallback,
    keyboard_release_callback: KeyEventCallback,
    mouse_move_callback: MouseMoveCallback,
    mouse_click_callback: MouseClickCallback,
    mouse_scroll_callback: MouseScrollCallback,
) -> Exception | None:
    global is_redirecting, keyboard_listener, main_errno, toggle_event

    def before_toggle(is_redirecting: bool):
        if is_redirecting:
            last_received = ReceivedClipboardText.read()
            current_clipboard_content = Clipboard.safe_paste()
            if exit_event.is_set(): return
            if not get_config().sync_clipboard: return
            if current_clipboard_content is None: return
            if last_received is not None and\
               last_received == current_clipboard_content: return
            send_data_async(SetClipboardEvent(current_clipboard_content).serialize())

    def after_toggle(is_redirecting: bool):
        nonlocal show_mask, hide_mask,\
            start_edge_portal, pause_edge_portal
        if is_redirecting:
            if not get_config().share_keyboard_only:
                show_mask(); start_edge_portal()
            LOGGER.write(LogType.Info, "Input redirecting enabled.")
        else:
            send_data(KeyEmptyEvent().serialize())
            hide_mask(); pause_edge_portal()
            LOGGER.write(LogType.Info, "Input redirecting disabled.")

    main_errno = send_data(GetClipboardEvent().serialize()) # start server clipboard sync
    show_mask, hide_mask, exit_mask = mask_thread_factory()
    start_edge_portal, pause_edge_portal, close_edge_portal = edge_portal_thread_factory()

    keyboard_listener = None
    mouse_listener = mouse.Listener(
        on_move=mouse_move_handler_factory(mouse_move_callback),
        on_click=mouse_click_handler_factory(mouse_click_callback),
        on_scroll=mouse_scroll_handler_factory(mouse_scroll_callback),
    )
    mouse_listener.start()
    while not exit_event.is_set() and main_errno is None:
        if (res := after_toggle(is_redirecting)) is not None:
            main_errno = res; break

        keyboard_listener = keyboard.Listener(
            suppress=is_redirecting,
            on_press=keyboard_press_handler_factory(keyboard_press_callback),
            on_release=keyboard_release_handler_factory(keyboard_release_callback),
        )
        keyboard_listener.start()
        toggle_event.wait()
        toggle_event.clear()
        before_toggle(is_redirecting)
        keyboard_listener.stop()

    mouse_listener.stop()
    exit_mask()
    close_edge_portal()
    return main_errno
