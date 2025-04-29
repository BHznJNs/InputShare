import sys
from typing import Dict, Literal
from utils.i18n import get_i18n
from utils.network.port_check import NoUsablePortException, find_available_port
from utils.notification import Notification, send_notification

i18n = get_i18n()
Key = Literal["scrcpy_port", "reporter_port"]
__port_dict: Dict[Key, int] = {}

def get_port(port: Key, default_val: int) -> int:
    if port in __port_dict:
        return __port_dict[port]

    try: target_port = find_available_port(default_val)
    except NoUsablePortException:
        send_notification(Notification(
            i18n(["NetworkError", "网络错误"]),
            i18n(["No usable TCP port!", "无可用的 TCP 端口。"]),
        ))
        sys.exit(1)
    __port_dict[port] = target_port
    return target_port
