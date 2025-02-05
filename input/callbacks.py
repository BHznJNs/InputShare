import asyncio
import socket
import threading
import time
import queue

from concurrent.futures import ThreadPoolExecutor
from typing import Callable
from pynput import mouse, keyboard
from scrcpy_client import key_scancode_map
from scrcpy_client.android_def import AKeyCode, AKeyEventAction
from scrcpy_client.hid_def import HID_KEYBOARD_MAX_KEYS, HID_MouseButton, HIDKeymod, KeymodStateStore, MouseButtonStateStore
from scrcpy_client.hid_event import HIDKeyboardInitEvent, KeyEmptyEvent, KeyEvent, MouseClickEvent, MouseMoveEvent, MouseScrollEvent, HIDMouseInitEvent
from scrcpy_client.inject_event import InjectKeyCode
from scrcpy_client.sdl_def import SDL_Scancode
from input.edge_portal import edge_portal_passing_event
from utils.config_manager import get_config

CallbackResult = Exception | None
SendDataCallback = Callable[[bytes], CallbackResult]
SendDataAsyncCallback = Callable[[bytes], None]
KeyEventCallback = Callable[[keyboard.Key | keyboard.KeyCode, bool], CallbackResult]
MouseMoveCallback = Callable[[int, int, bool], CallbackResult]
MouseClickCallback = Callable[[int, int, mouse.Button, bool, bool], CallbackResult]
MouseScrollCallback = Callable[[int, int, int, int, bool], CallbackResult]

def _customized_shortcuts(
    k: SDL_Scancode | HIDKeymod | AKeyCode,
    keymod_state: KeymodStateStore,
    is_redirecting: bool,
) -> list[bytes] | None:
    if is_redirecting: return None
    if keymod_state.has_key(HIDKeymod.HID_MOD_LEFT_ALT) or keymod_state.has_key(HIDKeymod.HID_MOD_RIGHT_ALT):
        if k in [SDL_Scancode.SDL_SCANCODE_UP, SDL_Scancode.SDL_SCANCODE_DOWN]:
            return [KeyEvent(KeymodStateStore(), [k]).serialize(), KeyEmptyEvent().serialize()]
        if k == SDL_Scancode.SDL_SCANCODE_LEFTBRACKET:
            return [
                InjectKeyCode(AKeyCode.AKEYCODE_MEDIA_PREVIOUS, AKeyEventAction.AKEY_EVENT_ACTION_DOWN).serialize(),
                InjectKeyCode(AKeyCode.AKEYCODE_MEDIA_PREVIOUS, AKeyEventAction.AKEY_EVENT_ACTION_UP).serialize()
            ]
        if k == SDL_Scancode.SDL_SCANCODE_RIGHTBRACKET:
            return [
                InjectKeyCode(AKeyCode.AKEYCODE_MEDIA_NEXT, AKeyEventAction.AKEY_EVENT_ACTION_DOWN).serialize(),
                InjectKeyCode(AKeyCode.AKEYCODE_MEDIA_NEXT, AKeyEventAction.AKEY_EVENT_ACTION_UP).serialize()
            ]
        if k == SDL_Scancode.SDL_SCANCODE_BACKSLASH:
            return [
                InjectKeyCode(AKeyCode.AKEYCODE_MEDIA_PLAY_PAUSE, AKeyEventAction.AKEY_EVENT_ACTION_DOWN).serialize(),
                InjectKeyCode(AKeyCode.AKEYCODE_MEDIA_PLAY_PAUSE, AKeyEventAction.AKEY_EVENT_ACTION_UP).serialize()
            ]
    return None

def _compute_mouse_pointer_diff(cur_x: int, cur_y: int, last_x: int, last_y: int) -> tuple[int, int]:
    diff_x = cur_x - last_x
    diff_y = cur_y - last_y
    speed = (diff_x ** 2 + diff_y ** 2) ** 0.5
    speed_factor = get_config().mouse_speed
    # check speed to prevent divide-by-zero error
    min_scale = max(1, speed_factor / 2.5)
    adjusted_scale = 1 if speed == 0 else min(min_scale, speed_factor / (speed ** 0.6))
    diff_x = int(diff_x * adjusted_scale)
    diff_y = int(diff_y * adjusted_scale)
    return diff_x, diff_y

def callback_context_wrapper(
    client_socket: socket.socket,
) -> tuple[
    SendDataCallback, SendDataAsyncCallback,
    KeyEventCallback, KeyEventCallback,
    MouseMoveCallback, MouseClickCallback, MouseScrollCallback,
]:
    from input.controller import schedule_exit

    executor = ThreadPoolExecutor()
    def send_data(data: bytes) -> CallbackResult:
        nonlocal client_socket, wakeup_counter
        wakeup_counter = 0
        try: client_socket.sendall(data)
        except Exception as e: return e
        return None
    
    def send_data_async(data: bytes):
        async def _async(data: bytes):
            res = await asyncio\
                .get_running_loop()\
                .run_in_executor(executor, send_data, data)
            if res is not None: schedule_exit(res)
        asyncio.run(_async(data))

    keyboard_init = HIDKeyboardInitEvent()
    send_data(keyboard_init.serialize())
    keymod_state = KeymodStateStore()
    key_list: list[SDL_Scancode] = []
    manual_device_sleep = False

    def keyboard_press_callback(k: keyboard.Key | keyboard.KeyCode, is_redirecting: bool):
        if k not in key_scancode_map: return None
        generic_key = key_scancode_map[k]
        shortcut_data = _customized_shortcuts(generic_key, keymod_state, is_redirecting)
        if shortcut_data is not None:
            for data in shortcut_data:
                send_data_async(data); return

        if type(generic_key) == HIDKeymod:
            keymod_state.keydown(generic_key)

        if not is_redirecting: return None
        if type(generic_key) == AKeyCode:
            nonlocal manual_device_sleep
            if generic_key == AKeyCode.AKEYCODE_SOFT_SLEEP: manual_device_sleep = True
            if generic_key == AKeyCode.AKEYCODE_WAKEUP:     manual_device_sleep = False
            inject_key_code = InjectKeyCode(generic_key, AKeyEventAction.AKEY_EVENT_ACTION_DOWN)
            send_data_async(inject_key_code.serialize()); return
        if type(generic_key) == SDL_Scancode and generic_key not in key_list:
            key_list.append(generic_key)
            if len(key_list) > HID_KEYBOARD_MAX_KEYS:
                key_to_remove = key_list[0]
                key_list.remove(key_to_remove)
        key_event = KeyEvent(keymod_state, key_list)
        send_data_async(key_event.serialize()); return

    def keyboard_release_callback(k: keyboard.Key | keyboard.KeyCode, is_redirecting: bool):
        if k not in key_scancode_map: return None
        generic_key = key_scancode_map[k]
        if type(generic_key) == HIDKeymod:
            keymod_state.keyup(generic_key)

        if not is_redirecting: return None
        if type(generic_key) == AKeyCode:
            inject_key_code = InjectKeyCode(generic_key, AKeyEventAction.AKEY_EVENT_ACTION_UP)
            send_data_async(inject_key_code.serialize()); return
        if type(generic_key) == SDL_Scancode and generic_key in key_list:
            key_list.remove(generic_key)
        key_event = KeyEvent(keymod_state, key_list)
        send_data_async(key_event.serialize()); return

    # --- --- --- --- --- ---

    mouse_init = HIDMouseInitEvent()
    send_data(mouse_init.serialize())
    last_mouse_point: tuple[int, int] | None = None
    mouse_button_state = MouseButtonStateStore()
    movement_queue: queue.Queue[tuple[int, int]] = queue.Queue(maxsize=5)
    wakeup_counter = 0

    def mouse_movement_sender():
        nonlocal movement_queue, wakeup_counter

        def send_wakeup_signal() -> CallbackResult:
            key_down = InjectKeyCode(AKeyCode.AKEYCODE_WAKEUP, AKeyEventAction.AKEY_EVENT_ACTION_DOWN)
            key_up   = InjectKeyCode(AKeyCode.AKEYCODE_WAKEUP, AKeyEventAction.AKEY_EVENT_ACTION_UP)
            for key in [key_down, key_up]:
                res = send_data(key.serialize())
                if res is not None: return res

        INTERVAL_SEC = 1 / 125 # the most common mouse polling rate
        LOOP_FREQUENCY = int(1 / (INTERVAL_SEC * 2))
        WAKEUP_INTERVAL_SEC = 5
        WAKEUP_COUNT_MODULO = LOOP_FREQUENCY * WAKEUP_INTERVAL_SEC

        no_move_timer = time.perf_counter() 
        while True:
            try:# adapt different polling rates.
                # when mouse moves, the loop frequency equals polling rate;
                # when no mouse movement, `movement_queue.get` throws error,
                # and the loop frequency is `1 / (INTERVAL_SEC * 2)`.
                dx, dy = movement_queue.get(block=True, timeout=INTERVAL_SEC)
                event = MouseMoveEvent(dx, dy, mouse_button_state)
                if (res := send_data(event.serialize())) is not None:
                    schedule_exit(res); break
                no_move_timer = None
                continue
            except: pass

            # when there is no mouse movement for `WAKEUP_INTERVAL_SEC * 2` seconds
            # and the `keep_wakeup` is True,
            # send wakeup signal every `WAKEUP_INTERVAL_SEC` second.
            current_time = time.perf_counter()
            if no_move_timer is None: no_move_timer = current_time 
            if current_time - no_move_timer > WAKEUP_INTERVAL_SEC:
                if not get_config().keep_wakeup: continue
                wakeup_counter += 1
                if wakeup_counter % WAKEUP_COUNT_MODULO or manual_device_sleep: continue
                if (res := send_wakeup_signal()) is not None:
                    schedule_exit(res); break
                continue
            # when there is no mouse movement within `WAKEUP_INTERVAL_SEC * 2` seconds,
            # send zero movement mouse event.
            event = MouseMoveEvent(0, 0, mouse_button_state)
            if (res := send_data(event.serialize())) is not None:
                schedule_exit(res); break
    threading.Thread(target=mouse_movement_sender, daemon=True).start()

    def mouse_move_callback(cur_x: int, cur_y: int, is_redirecting: bool):
        nonlocal last_mouse_point
        if not is_redirecting or get_config().share_keyboard_only:
            last_mouse_point = None
            return None

        if edge_portal_passing_event.is_set():
            last_mouse_point = (cur_x, cur_y)
            edge_portal_passing_event.clear()
            return None
        if last_mouse_point is None:
            last_mouse_point = (cur_x, cur_y)
            return None
        diff_movement = _compute_mouse_pointer_diff(cur_x, cur_y, *last_mouse_point)
        last_mouse_point = (cur_x, cur_y)
        try: movement_queue.put(diff_movement, block=False)
        except queue.Full: movement_queue.get() # if the queue is full, remove the oldest element

    def mouse_click_callback(_cur_x: int, _cur_y: int, button: mouse.Button, pressed: bool, is_redirecting: bool):
        nonlocal last_mouse_point
        if not is_redirecting or get_config().share_keyboard_only:
            return None

        hid_button = HID_MouseButton.MOUSE_BUTTON_NONE
        keyevent_action = AKeyEventAction.AKEY_EVENT_ACTION_DOWN if pressed else AKeyEventAction.AKEY_EVENT_ACTION_UP
        match button:
            case mouse.Button.left:
                hid_button = HID_MouseButton.MOUSE_BUTTON_LEFT
            case mouse.Button.right:
                hid_button = HID_MouseButton.MOUSE_BUTTON_RIGHT
            case mouse.Button.middle:
                hid_button = HID_MouseButton.MOUSE_BUTTON_MIDDLE
            case mouse.Button.x1:
                keycode = InjectKeyCode(AKeyCode.AKEYCODE_BACK, keyevent_action)
                send_data_async(keycode.serialize()); return
            case mouse.Button.x2:
                keycode = InjectKeyCode(AKeyCode.AKEYCODE_NOTIFICATION, keyevent_action)
                send_data_async(keycode.serialize()); return

        if pressed: mouse_button_state.mouse_down(hid_button)
        else: mouse_button_state.mouse_up(hid_button)
        mouse_click_event = MouseClickEvent(mouse_button_state)
        send_data_async(mouse_click_event.serialize())

    def mouse_scroll_callback(_cur_x: int, _cur_y: int, _dx: int, dy: int, is_redirecting: bool):
        if not is_redirecting or get_config().share_keyboard_only:
            return None
        mouse_scroll_event = MouseScrollEvent(dy)
        send_data_async(mouse_scroll_event.serialize())

    return (
        send_data,
        send_data_async,
        keyboard_press_callback,
        keyboard_release_callback,
        mouse_move_callback,
        mouse_click_callback,
        mouse_scroll_callback,
    )
