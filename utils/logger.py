import sys
import os
from enum import Enum
from utils import script_abs_path
from utils.multiprocess import current_process_name, is_child_process

class LogType(Enum):
    Info    = 0
    Error   = 1
    Adb     = 2
    Server  = 3

class Logger:
    DEFAULT_LOG_FILE_NAME = "InputShare-debug.log" if not is_child_process() else\
                           f"InputShare-debug-{current_process_name()}.log"

    LOG_TYPE_NAME_MAP = {
        LogType.Info  : "Info",
        LogType.Error : "Error",
        LogType.Adb   : "ADB",
        LogType.Server: "Server",
    }

    def __init__(self, path: str) -> None:
        self.file = open(path, "w+", encoding="utf-8")
        self.file.write("")

    def __del__(self):
        self.file.close()

    def write(self, type: LogType, message: str):
        log_type_name = Logger.LOG_TYPE_NAME_MAP[type]
        complete_log_message = f"[{log_type_name}] {message}"
        print(complete_log_message)
        self.file.write(complete_log_message + "\n")
        self.file.flush()

def todo(msg: str | None=None):
    global LOGGER
    if msg is None:
        LOGGER.write(LogType.Error, "not yet implemented")
    else:
        LOGGER.write(LogType.Error, "not yet implemented: " + msg)

def unreachable(msg: str | None=None):
    global LOGGER
    if msg is None:
        LOGGER.write(LogType.Error, "entered unreachable code")
    else:
        LOGGER.write(LogType.Error, "entered unreachable code: " + msg)

if getattr(sys, "frozen", False):
    log_base_dir = os.path.dirname(sys.executable)
else:
    script_path = script_abs_path(__file__)
    log_base_dir = script_path.parent

log_path = os.path.join(log_base_dir, Logger.DEFAULT_LOG_FILE_NAME)
LOGGER = Logger(log_path)
