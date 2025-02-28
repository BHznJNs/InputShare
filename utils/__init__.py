import locale
import time
import screeninfo

from pathlib import Path
from typing import Any, Callable

VoidCallable = Callable[[], None]

def clamp(v: int, x: int, y: int) -> int:
    return min(max(v, x), y)

def screen_size() -> tuple[int, int]:
    monitor = screeninfo.get_monitors()[0]
    return monitor.width, monitor.height

def script_abs_path(_file: str) -> Path:
    return Path(_file).resolve().parent

ENGLISH_LANGUAGE = "en_"
CHINESE_LANGUAGE = "zh_"
def current_language_code():
    code = locale.getdefaultlocale()[0]
    if code is None: return None
    if code.startswith(ENGLISH_LANGUAGE): return ENGLISH_LANGUAGE
    if code.startswith(CHINESE_LANGUAGE): return CHINESE_LANGUAGE
    return code

class DevicePosition:
    TOP    = "top"
    RIGHT  = "right"
    BOTTOM = "bottom"
    LEFT   = "left"

    @staticmethod
    def parse(pos: str) -> str:
        match pos:
            case DevicePosition.TOP    : return "down"
            case DevicePosition.RIGHT  : return "left"
            case DevicePosition.BOTTOM : return "up"
            case DevicePosition.LEFT   : return "right"
            case _                     : return "left"

class TimeCounter:
    __count: int = 0
    __timer: float | None = None
    interval_sec: float
    callback: Callable[[int], Any]

    def __init__(self, interval_sec: float, callback: Callable[[int], Any]) -> None:
        self.interval_sec = interval_sec
        self.callback = callback

    def count(self):
        if self.__timer is None:
            self.__count = 1
            self.__timer = time.perf_counter()
            return

        self.__count += 1
        current_sec = time.perf_counter()
        if current_sec - self.__timer >= self.interval_sec:
            self.callback(self.__count)
            self.__count = 0
            self.__timer = current_sec
