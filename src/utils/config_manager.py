import atexit
import sys, os
import json
import threading
from dataclasses import asdict, dataclass, fields
from typing import Any, Literal
from sync_dataclasses import SyncDataClass
from utils import DevicePosition, ENGLISH_LANGUAGE,\
                  current_language_code, script_abs_path

DEFAULT_CONFIG_FILE_NAME = "config.json"

@dataclass
class ConfigFile(SyncDataClass):
    device_ip1: str = ""
    detect_port: bool = False
    sync_clipboard: bool = True
    share_keyboard_only: bool = False

    # settings
    theme: Literal["system", "dark", "light"] = "system"
    mouse_speed: float = 2
    edge_toggling: bool = False
    device_position: str = DevicePosition.RIGHT
    trigger_margin: int = 80
    keep_wakeup: bool = False
    language: str = current_language_code() or ENGLISH_LANGUAGE

class ConfigManager:
    def __init__(self):
        self._lock = threading.Lock()
        file_path = self.path = ConfigManager.storage_path()
        self.is_first_use = not os.path.exists(file_path)
        if self.is_first_use: 
            ConfigManager.create_default_config(file_path)
        self.config = ConfigManager.read_config(file_path)
        atexit.register(self.save)

    def save(self):
        with self._lock:
            config_dict = asdict(self.config)
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
        config_json = json.dumps(asdict(default_config))
        with open(path, "w") as f: 
            f.write(config_json)

    @staticmethod
    def parse_config_json(something: dict | str | Any) -> ConfigFile:
        # if is a string, parse it as json
        if type(something) == str: something = json.loads(something)
        # if is an invalid object, return default config
        if type(something) != dict: return ConfigFile()

        expected_fields = {f.name: f.type for f in fields(ConfigFile)}
        filtered_fields = {}
        for key, item in something.items():
            if key not in expected_fields: continue
            if type(item) != expected_fields[key]: continue
            filtered_fields[key] = item
        return ConfigFile(**filtered_fields)

    @staticmethod
    def read_config(path: str) -> ConfigFile:
        with open(path, "r") as f: config_content = json.load(f)
        return ConfigManager.parse_config_json(config_content)

    @staticmethod
    def storage_path() -> str:
        if getattr(sys, "frozen", False):
            config_base_dir = os.path.dirname(sys.executable)
        else:
            script_path = script_abs_path(__file__)
            config_base_dir = script_path.parent
        config_path = os.path.join(config_base_dir, DEFAULT_CONFIG_FILE_NAME)
        return config_path

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
