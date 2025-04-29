from enum import IntEnum
from scrcpy_client.sdl_def import SDL_BUTTON, SDL_BUTTON_LEFT, SDL_BUTTON_MIDDLE, SDL_BUTTON_RIGHT, SDL_BUTTON_X1, SDL_BUTTON_X2

'''
HID Mouse Definition
'''

HID_ID_MOUSE = 2
HID_MOUSE_INPUT_SIZE = 4
HID_INPUT_DATA_MAX_SIZE = 15

class HID_MouseButton(IntEnum):
    MOUSE_BUTTON_NONE = 0
    MOUSE_BUTTON_LEFT = SDL_BUTTON(SDL_BUTTON_LEFT)
    MOUSE_BUTTON_RIGHT = SDL_BUTTON(SDL_BUTTON_RIGHT)
    MOUSE_BUTTON_MIDDLE = SDL_BUTTON(SDL_BUTTON_MIDDLE)
    MOUSE_BUTTON_X1 = SDL_BUTTON(SDL_BUTTON_X1)
    MOUSE_BUTTON_X2 = SDL_BUTTON(SDL_BUTTON_X2)

class MouseButtonStateStore:
    def __init__(self):
        self.mouse_button = HID_MouseButton.MOUSE_BUTTON_NONE.value
    def mouse_down(self, button: HID_MouseButton):
        self.mouse_button |= button.value
    def mouse_up(self, button: HID_MouseButton):
        self.mouse_button ^= button.value

HID_MOUSE_REPORT_DESC = bytes([
    # Usage Page (Generic Desktop)
    0x05, 0x01,
    # Usage (Mouse)
    0x09, 0x02,

    # Collection (Application)
    0xA1, 0x01,

    # Usage (Pointer)
    0x09, 0x01,

    # Collection (Physical)
    0xA1, 0x00,

    # Usage Page (Buttons)
    0x05, 0x09,

    # Usage Minimum (1)
    0x19, 0x01,
    # Usage Maximum (5)
    0x29, 0x05,
    # Logical Minimum (0)
    0x15, 0x00,
    # Logical Maximum (1)
    0x25, 0x01,
    # Report Count (5)
    0x95, 0x05,
    # Report Size (1)
    0x75, 0x01,
    # Input (Data, Variable, Absolute): 5 buttons bits
    0x81, 0x02,

    # Report Count (1)
    0x95, 0x01,
    # Report Size (3)
    0x75, 0x03,
    # Input (Constant): 3 bits padding
    0x81, 0x01,

    # Usage Page (Generic Desktop)
    0x05, 0x01,
    # Usage (X)
    0x09, 0x30,
    # Usage (Y)
    0x09, 0x31,
    # Usage (Wheel)
    0x09, 0x38,
    # Logical Minimum (-127)
    0x15, 0x81,
    # Logical Maximum (127)
    0x25, 0x7F,
    # Report Size (8)
    0x75, 0x08,
    # Report Count (3)
    0x95, 0x03,
    # Input (Data, Variable, Relative): 3 position bytes (X, Y, Wheel)
    0x81, 0x06,

    # End Collection
    0xC0,

    # End Collection
    0xC0,
])

# --- --- --- --- --- ---

'''
HID Keyboard Definition
'''

HID_ID_KEYBOARD = 1
HID_KEYBOARD_KEYS = 0x66
HID_KEYBOARD_INDEX_KEYS = 2
HID_KEYBOARD_MAX_KEYS = 6
HID_KEYBOARD_INPUT_SIZE = HID_KEYBOARD_INDEX_KEYS + HID_KEYBOARD_MAX_KEYS

HID_MOD_NONE = 0x00
HID_MOD_LEFT_CONTROL = (1 << 0)
HID_MOD_LEFT_SHIFT = (1 << 1)
HID_MOD_LEFT_ALT = (1 << 2)
HID_MOD_LEFT_GUI = (1 << 3)
HID_MOD_RIGHT_CONTROL = (1 << 4)
HID_MOD_RIGHT_SHIFT = (1 << 5)
HID_MOD_RIGHT_ALT = (1 << 6)
HID_MOD_RIGHT_GUI = (1 << 7)

class HIDKeymod(IntEnum):
    HID_MOD_NONE = 0x00
    HID_MOD_LEFT_CONTROL = (1 << 0)
    HID_MOD_LEFT_SHIFT = (1 << 1)
    HID_MOD_LEFT_ALT = (1 << 2)
    HID_MOD_LEFT_GUI = (1 << 3) # left Win | Command
    HID_MOD_RIGHT_CONTROL = (1 << 4)
    HID_MOD_RIGHT_SHIFT = (1 << 5)
    HID_MOD_RIGHT_ALT = (1 << 6)
    HID_MOD_RIGHT_GUI = (1 << 7) # right Win | Command

    HID_MOD_ALT = HID_MOD_LEFT_ALT | HID_MOD_RIGHT_ALT
    HID_MOD_SHIFT = HID_MOD_LEFT_SHIFT | HID_MOD_RIGHT_SHIFT
    HID_MOD_CONTROL = HID_MOD_LEFT_CONTROL | HID_MOD_RIGHT_CONTROL

class KeymodStateStore:
    def __init__(self):
        self.key = HIDKeymod.HID_MOD_NONE.value
    def keydown(self, key: HIDKeymod):
        self.key |= key.value
    def keyup(self, key: HIDKeymod):
        if self.has_key(key):
            self.key ^= key.value
    def is_key(self, key: HIDKeymod):
        return self.key == key.value
    def has_key(self, key: HIDKeymod):
        return self.key & key.value

HID_KEYBOARD_REPORT_DESC = bytes([
    # Usage Page (Generic Desktop)
    0x05, 0x01,
    # Usage (Keyboard)
    0x09, 0x06,

    # Collection (Application)
    0xA1, 0x01,

    # Usage Page (Key Codes)
    0x05, 0x07,
    # Usage Minimum (224)
    0x19, 0xE0,
    # Usage Maximum (231)
    0x29, 0xE7,
    # Logical Minimum (0)
    0x15, 0x00,
    # Logical Maximum (1)
    0x25, 0x01,
    # Report Size (1)
    0x75, 0x01,
    # Report Count (8)
    0x95, 0x08,
    # Input (Data, Variable, Absolute): Modifier byte
    0x81, 0x02,

    # Report Size (8)
    0x75, 0x08,
    # Report Count (1)
    0x95, 0x01,
    # Input (Constant): Reserved byte
    0x81, 0x01,

    # Usage Page (LEDs)
    0x05, 0x08,
    # Usage Minimum (1)
    0x19, 0x01,
    # Usage Maximum (5)
    0x29, 0x05,
    # Report Size (1)
    0x75, 0x01,
    # Report Count (5)
    0x95, 0x05,
    # Output (Data, Variable, Absolute): LED report
    0x91, 0x02,

    # Report Size (3)
    0x75, 0x03,
    # Report Count (1)
    0x95, 0x01,
    # Output (Constant): LED report padding
    0x91, 0x01,

    # Usage Page (Key Codes)
    0x05, 0x07,
    # Usage Minimum (0)
    0x19, 0x00,
    # Usage Maximum (101)
    0x29, HID_KEYBOARD_KEYS - 1,
    # Logical Minimum (0)
    0x15, 0x00,
    # Logical Maximum(101)
    0x25, HID_KEYBOARD_KEYS - 1,
    # Report Size (8)
    0x75, 0x08,
    # Report Count (6)
    0x95, HID_KEYBOARD_MAX_KEYS,
    # Input (Data, Array): Keys
    0x81, 0x00,

    # End Collection
    0xC0
])

