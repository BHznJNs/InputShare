import time
import threading
import pynput

from typing import Callable
from server.reporter_receiver import DevicePosition
from utils import VoidCallable, screen_size
from utils.config_manager import get_config
from utils.logger import LOGGER, LogType

EDGE_PORTAL_LOOP_INTERVAL_SEC = 1 / 1000

screen_width, screen_height = screen_size()
mouse_controller = pynput.mouse.Controller()
pause_event = threading.Event()
close_event = threading.Event()
pause_edge_toggling_event = threading.Event()
edge_portal_passing_event = threading.Event()

edge_toggling_callbacks = []
def append_edge_toggling_callback(callback: Callable):
    global edge_toggling_callbacks
    edge_toggling_callbacks.append(callback)
def call_edge_toggling_callbacks():
    # this should be called after toggled by android client
    global edge_toggling_callbacks
    for callback in edge_toggling_callbacks: callback()

config = get_config()

is_edge_toggling_enabled = config.edge_toggling
if is_edge_toggling_enabled:
    device_position     = config.device_position
    trigger_margin      = config.trigger_margin
    is_device_at_top    = device_position == DevicePosition.TOP
    is_device_at_right  = device_position == DevicePosition.RIGHT
    is_device_at_bottom = device_position == DevicePosition.BOTTOM
    is_device_at_left   = device_position == DevicePosition.LEFT

def pause_edge_toggling():
    LOGGER.write(LogType.Info, "Edge toggling paused.")
    pause_edge_toggling_event.set()
def resume_edge_toggling():
    LOGGER.write(LogType.Info, "Edge toggling resumed.")
    pause_edge_toggling_event.clear()

def create_edge_portal():
    from input.controller import schedule_toggle as main_schedule_toggle

    def return_to_before_toggling():
        nonlocal cursor_pos_before_toggling
        SIDE_MARGIN = 2
        if pause_event.is_set() or pause_edge_toggling_event.is_set(): return
        if cursor_pos_before_toggling == None: return
        temp_x, temp_y = cursor_pos_before_toggling
        if   is_device_at_right : mouse_controller.position = (temp_x - SIDE_MARGIN, temp_y)
        elif is_device_at_left  : mouse_controller.position = (SIDE_MARGIN, temp_y)
        elif is_device_at_top   : mouse_controller.position = (temp_x, SIDE_MARGIN)
        elif is_device_at_bottom: mouse_controller.position = (temp_x, temp_y - SIDE_MARGIN)
    append_edge_toggling_callback(return_to_before_toggling)
    cursor_pos_before_toggling = None

    while not close_event.is_set():
        temp_pos = mouse_controller.position
        if temp_pos == None:
            # since the value of `mouse_controller.position` may be None sometimes,
            # make it a check here.
            # see this issue: https://github.com/moses-palmer/pynput/issues/559
            time.sleep(EDGE_PORTAL_LOOP_INTERVAL_SEC)
            continue
        x, y = temp_pos
        is_at_left_side = x <= 0
        is_at_right_side = x >= screen_width - 1
        is_at_top_side = y <= 0
        is_at_bottom_side = y >= screen_height - 1

        if pause_event.is_set():
            if not is_edge_toggling_enabled or pause_edge_toggling_event.is_set():
                time.sleep(EDGE_PORTAL_LOOP_INTERVAL_SEC)
                continue
            is_y_at_target_range = trigger_margin < y < screen_height - trigger_margin
            if (is_device_at_right  and is_at_right_side and is_y_at_target_range) or\
               (is_device_at_left   and is_at_left_side  and is_y_at_target_range) or\
               (is_device_at_top    and is_at_top_side)    or\
               (is_device_at_bottom and is_at_bottom_side):
                cursor_pos_before_toggling = temp_pos
                main_schedule_toggle(True)
        else:
            if is_at_left_side or is_at_right_side or is_at_top_side or is_at_bottom_side:
                edge_portal_passing_event.set()
            if is_at_left_side:
                mouse_controller.move(screen_width - 1, 0)
            if is_at_right_side:
                mouse_controller.move(1 - screen_width, 0)
            if is_at_top_side:
                mouse_controller.move(0, screen_height - 1)
            if is_at_bottom_side:
                mouse_controller.move(0, 1 - screen_height)

        time.sleep(EDGE_PORTAL_LOOP_INTERVAL_SEC)
    LOGGER.write(LogType.Info, "Edge portal closed.")

def edge_portal_thread_factory() -> tuple[
    VoidCallable, VoidCallable, VoidCallable
]:
    def start_edge_portal():
        pause_event.clear()
    def pause_edge_portal():
        pause_event.set()
    def close_edge_portal():
        close_event.set()

    pause_event.set()
    threading.Thread(target=create_edge_portal, daemon=True).start()
    return start_edge_portal, pause_edge_portal, close_edge_portal
