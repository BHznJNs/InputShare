from dataclasses import dataclass
from notifypy import Notify
from ui import ICON_ICO_PATH

global_notification = Notify(
    default_notification_icon=str(ICON_ICO_PATH),
)

@dataclass
class Notification:
    title: str
    message: str

def send_notification(notification: Notification | None):
    global global_notification
    if notification is None: return

    from utils.i18n import get_i18n
    global_notification.application_name = get_i18n()(["InputShare", "输入流转"])
    global_notification.title = notification.title
    global_notification.message = notification.message
    global_notification.send(block=False)
