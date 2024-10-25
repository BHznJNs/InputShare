import socket

from subprocess import Popen
from pynput import mouse
from android import InjectKeyCode, AKeyEventAction, MouseClickEvent, MouseMoveEvent, MouseScrollEvent, UHIDCreateEvent
from android.motion_event import AMotionEventButtons
from adb_controller import key_event_map
from input.edge_portal import edge_portal_passing_event
from input.controller import Key, KeyCode, KeyEventCallback, MouseClickCallback, MouseMoveCallback, MouseScrollCallback, StopException

def callback_context_wrapper(
    client_socket: socket.socket,
    server_process: Popen[str],
) -> tuple[
    KeyEventCallback, KeyEventCallback,
    MouseMoveCallback, MouseClickCallback, MouseScrollCallback,
]:
    def send_data(data: bytes):
        try:
            client_socket.sendall(data)
        except ConnectionAbortedError as e:
            print("[Error] Server error: ", e)
            client_socket.close()
            server_process.terminate()
            raise StopException
        except:
            print("[Error] Send message error.")

    def keyboard_press_callback(k: Key | KeyCode, is_redirecting: bool):
        if not is_redirecting:
            return
        if k not in key_event_map:
            return
        akey_code = key_event_map[k]
        inject_key_code = InjectKeyCode(akey_code, AKeyEventAction.AKEY_EVENT_ACTION_DOWN)
        send_data(inject_key_code.serialize())

    def keyboard_release_callback(k: Key | KeyCode, is_redirecting: bool):
        if not is_redirecting:
            return
        if k not in key_event_map:
            return
        akey_code = key_event_map[k]
        inject_key_code = InjectKeyCode(akey_code, AKeyEventAction.AKEY_EVENT_ACTION_UP)
        send_data(inject_key_code.serialize())

    # --- --- --- --- --- ---

    mouse_init = UHIDCreateEvent()
    send_data(mouse_init.serialize())
    last_mouse_point: tuple[int, int] | None = None

    def compute_mouse_pointer_diff(cur_x: int, cur_y: int) -> tuple[int, int] | None:
        nonlocal last_mouse_point
        if last_mouse_point is None:
            last_mouse_point = (cur_x, cur_y)
            return None
        diff_x = cur_x - last_mouse_point[0]
        diff_y = cur_y - last_mouse_point[1]
        last_mouse_point = (cur_x, cur_y)
        return (diff_x, diff_y)

    def mouse_move_callback(cur_x: int, cur_y: int, is_redirecting: bool):
        nonlocal last_mouse_point
        if not is_redirecting:
            return
    
        if edge_portal_passing_event.is_set():
            last_mouse_point = None
            edge_portal_passing_event.clear()
            return
        res = compute_mouse_pointer_diff(cur_x, cur_y)
        if res is None:
            return
        diff_x, diff_y = res
        mouse_move_event = MouseMoveEvent(diff_x, diff_y, AMotionEventButtons.AMOTION_EVENT_BUTTON_NONE)
        send_data(mouse_move_event.serialize())

    def mouse_click_callback(_cur_x: int, _cur_y: int, button: mouse.Button, pressed: bool, is_redirecting: bool):
        nonlocal last_mouse_point
        if not is_redirecting:
            return
        abutton = AMotionEventButtons.AMOTION_EVENT_BUTTON_NONE
        if pressed:
            match button:
                case mouse.Button.left:
                    abutton = AMotionEventButtons.AMOTION_EVENT_BUTTON_PRIMARY
                case mouse.Button.right:
                    abutton = AMotionEventButtons.AMOTION_EVENT_BUTTON_SECONDARY
                case mouse.Button.middle:
                    abutton = AMotionEventButtons.AMOTION_EVENT_BUTTON_TERTIARY
        mouse_move_event = MouseClickEvent(abutton)
        send_data(mouse_move_event.serialize())
    
    def mouse_scroll_callback(_cur_x: int, _cur_y: int, _dx: int, dy: int, is_redirecting: bool):
        if not is_redirecting:
            return
        mouse_scroll_event = MouseScrollEvent(dy)
        send_data(mouse_scroll_event.serialize())

    return (
        keyboard_press_callback,
        keyboard_release_callback,
        mouse_move_callback,
        mouse_click_callback,
        mouse_scroll_callback
    )
