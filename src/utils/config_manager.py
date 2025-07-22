import atexit
import sys, os
import json
import threading
from dataclasses import asdict, dataclass, fields
from typing import Any, Literal
from pydantic import ValidationError, TypeAdapter
from pydantic.dataclasses import dataclass
from sync_dataclasses import SyncDataClass
from utils import DevicePosition, ENGLISH_LANGUAGE,\
                  current_language_code, get_local_path
from utils.logger import LOGGER, LogType

DEFAULT_CONFIG_FILE_NAME = "config.json"
Theme = Literal["system", "dark", "light"]

@dataclass
class ConfigFile(SyncDataClass):
    device_ip1: str = ""
    detect_port: bool = False
    sync_clipboard: bool = True
    share_keyboard_only: bool = False

    # hotkeys
    toggle_hotkey: str = "<ctrl>+<alt>+s"
    exit_hotkey: str = "<ctrl>+<alt>+q"

    # settings
    theme: Theme = "system"
    mouse_speed: float = 2
    edge_toggling: bool = False
    device_position: str = DevicePosition.RIGHT
    trigger_margin: int = 80
    keep_wakeup: bool = False
    language: str = current_language_code() or ENGLISH_LANGUAGE

    def to_dict(self) -> dict:
        return asdict(self)

class ConfigManager:
    validator = TypeAdapter(ConfigFile)

    def __init__(self):
        file_path = self.path = ConfigManager.storage_path()
        config_exists = not os.path.exists(file_path)
        if config_exists:
            ConfigManager.create_default_config(file_path)
        self.config = ConfigManager.read_config(file_path)
        self._lock = threading.Lock()
        atexit.register(self.save)

    def save(self):
        with self._lock:
            config_dict = self.config.to_dict()
        with open(self.path, "w") as f:
            json.dump(config_dict, f, indent=4)

    def use_new_config(self, new_config: dict | ConfigFile):
        with self._lock:
            if isinstance(new_config, ConfigFile):
                self.config = new_config
                return
            for key, value in new_config.items():
                if key not in ConfigFile.__dataclass_fields__: continue
                setattr(self.config, key, value)

    @staticmethod
    def create_default_config(path: str):
        default_config = ConfigFile()
        config_json = json.dumps(default_config.to_dict(), indent=4)
        with open(path, "w") as f: 
            f.write(config_json)

    @staticmethod
    def parse_config_json(something: dict | str | Any) -> ConfigFile:
        # if is a string, parse it as json
        if type(something) == str:
            try:
                something = json.loads(something)
            except json.JSONDecodeError:
                # if the string is not valid JSON or is empty, return default config.
                return ConfigFile()
        # if is an invalid object, return default config
        if type(something) != dict: return ConfigFile()

        try:
            validated = ConfigManager.validator.validate_python(something)
            return validated
        except ValidationError as e:
            LOGGER.write(LogType.Error, f"Failed to validate config: {e}")
            return ConfigFile()

    @staticmethod
    def read_config(path: str) -> ConfigFile:
        with open(path, "r") as f: config_content = json.load(f)
        return ConfigManager.parse_config_json(config_content)

    @staticmethod
    def storage_path() -> str:
        DEFAULT_CONFIG_PATH = get_local_path() / "config.json"
        return str(DEFAULT_CONFIG_PATH)

__config_instance: ConfigManager | None = None
__instance_lock = threading.Lock()

def get_config_manager() -> ConfigManager:
    global __config_instance
    with __instance_lock:
        if __config_instance is None:
            __config_instance = ConfigManager()
        return __config_instance

def get_config() -> ConfigFile:
    manager = get_config_manager()
    with manager._lock:
        return manager.config
