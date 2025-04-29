import threading
import time
import pyperclip

from utils.logger import LOGGER, LogType

class Clipboard:
    wait_time_second = 0.1
    retry_times = 5
    clipboard_lock = threading.Lock()

    @staticmethod
    def safe_paste() -> str | None:
        with Clipboard.clipboard_lock:
            for _ in range(Clipboard.retry_times):
                try:
                    return pyperclip.paste()
                except pyperclip.PyperclipWindowsException:
                    time.sleep(Clipboard.wait_time_second)
            LOGGER.write(LogType.Error, "Failed to access clipboard after several attempts.")
            return None

    @staticmethod
    def safe_copy(text: str):
        with Clipboard.clipboard_lock:
            for _ in range(Clipboard.retry_times):
                try:
                    pyperclip.copy(text)
                    return
                except pyperclip.PyperclipWindowsException:
                    time.sleep(Clipboard.wait_time_second)
            LOGGER.write(LogType.Error, "Failed to copy to clipboard after several attempts.")
