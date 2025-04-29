import struct

from scrcpy_client import ControlMsgType
from scrcpy_client.hid_def import HID_ID_KEYBOARD, HID_ID_MOUSE, HID_KEYBOARD_INPUT_SIZE, HID_KEYBOARD_REPORT_DESC, HID_MOUSE_INPUT_SIZE, HID_MOUSE_REPORT_DESC, KeymodStateStore, MouseButtonStateStore
from scrcpy_client.sdl_def import SDL_Scancode
from utils import clamp

class HIDKeyboardInitEvent:
    msg_type: ControlMsgType = ControlMsgType.MSG_TYPE_UHID_CREATE # 8
    id_ = HID_ID_KEYBOARD # 16
    name = 0 # 8
    report_desc_size: int = len(HID_KEYBOARD_REPORT_DESC) # 16
    report_desc: bytes = HID_KEYBOARD_REPORT_DESC
    def serialize(self) -> bytes:
        buf = struct.pack(
            ">BHBH",
            self.msg_type.value,
            self.id_,
            self.name,
            self.report_desc_size,
        )
        buf += self.report_desc
        return buf

class HIDKeyboardInputEvent:
    msg_type: ControlMsgType = ControlMsgType.MSG_TYPE_UHID_INPUT # 8
    id_: int = HID_ID_KEYBOARD # 16
    size: int = HID_KEYBOARD_INPUT_SIZE # 16

    def __init__(self, data: list[int]) -> None:
        self.data = bytes(data)
    
    def serialize(self) -> bytes:
        buf = struct.pack(
            ">BHH",
            self.msg_type.value,
            self.id_,
            self.size,
        )
        buf += self.data
        return buf

def KeyEvent(keymod: KeymodStateStore, keys: list[SDL_Scancode]) -> HIDKeyboardInputEvent:
    # [_, _, _, _, _, _, _, _]
    # length: 8
    # 0 -> mod key
    # 1 -> reserved, always 0
    # 2 - 7 -> keys pressed the same time (scancode)
    data: list[int] = [0] * HIDKeyboardInputEvent.size
    data[0] = keymod.key

    data_ptr = 2
    for k in keys:
        data[data_ptr] = k.value
        data_ptr += 1
    keyboard_event = HIDKeyboardInputEvent(data)
    return keyboard_event

def KeyEmptyEvent() -> HIDKeyboardInputEvent:
    data = [0] * HIDKeyboardInputEvent.size
    keyboard_event = HIDKeyboardInputEvent(data)
    return keyboard_event

# --- --- --- --- --- ---

class HIDMouseInitEvent:
    msg_type: ControlMsgType = ControlMsgType.MSG_TYPE_UHID_CREATE # 8
    id_: int = HID_ID_MOUSE # 16
    name = 0 # 8
    report_desc_size: int = len(HID_MOUSE_REPORT_DESC) # 16
    report_desc: bytes = HID_MOUSE_REPORT_DESC
    def serialize(self) -> bytes:
        buf = struct.pack(
            ">BHBH",
            self.msg_type.value,
            self.id_,
            self.name,
            self.report_desc_size,
        )
        buf += self.report_desc
        return buf

class HIDMouseInputEvent:
    msg_type: ControlMsgType = ControlMsgType.MSG_TYPE_UHID_INPUT # 8
    id_: int = HID_ID_MOUSE # 16
    size: int = HID_MOUSE_INPUT_SIZE # 16

    def __init__(self, data: list[int]) -> None:
        self.data = bytes(data)

    def serialize(self) -> bytes:
        buf = struct.pack(
            ">BHH",
            self.msg_type.value,
            self.id_,
            self.size,
        )
        buf += self.data
        return buf

def MouseMoveEvent(x: int, y: int, buttons_state: MouseButtonStateStore) -> HIDMouseInputEvent:
    data = [0, 0, 0, 0]
    data[0] = buttons_state.mouse_button
    data[1] = clamp(x, -127, 127) % 256
    data[2] = clamp(y, -127, 127) % 256
    data[3] = 0
    input_event = HIDMouseInputEvent(data)
    return input_event

def MouseClickEvent(buttons_state: MouseButtonStateStore) -> HIDMouseInputEvent:
    data = [0, 0, 0, 0]
    data[0] = buttons_state.mouse_button
    input_event = HIDMouseInputEvent(data)
    return input_event

def MouseScrollEvent(dy: int) -> HIDMouseInputEvent:
    data = [0, 0, 0, 0]
    data[3] = clamp(dy, -127, 127) % 256
    input_event = HIDMouseInputEvent(data)
    return input_event
