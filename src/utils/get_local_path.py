import os
from pathlib import Path

APP_NAME = "org.inputshare.desktop"

def get_local_path() -> Path:
    local_app_data_root = os.getenv("LOCALAPPDATA")

    if not local_app_data_root:
        raise RuntimeError("Can not find LOCALAPPDATA environment variable. Please ensure running on Windows.")

    app_dir = Path(local_app_data_root) / APP_NAME
    app_dir.mkdir(parents=True, exist_ok=True)
    return app_dir
