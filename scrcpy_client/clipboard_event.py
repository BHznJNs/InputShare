import struct

from enum import IntEnum
from scrcpy_client import ControlMsgType

class CopyKey(IntEnum):
    COPY_KEY_NONE = 0
    COPY_KEY_COPY = 1
    COPY_KEY_CUT  = 2

class DeviceMsgType(IntEnum):
    DEVICE_MSG_TYPE_CLIPBOARD = 0
    DEVICE_MSG_TYPE_ACK_CLIPBOARD = 1
    DEVICE_MSG_TYPE_UHID_OUTPUT = 2

class GetClipboardEvent:
    msg_type: ControlMsgType = ControlMsgType.MSG_TYPE_GET_CLIPBOARD
    copy_key: CopyKey = CopyKey.COPY_KEY_COPY

    def serialize(self) -> bytes:
        buf = struct.pack(
            ">BB",
            self.msg_type.value,
            self.copy_key.value,
        )
        return buf

class GetClipboardEventResponse:
    @staticmethod
    def deserialize(data: bytes) -> str | None:
        msg_type = data[0]
        if msg_type != DeviceMsgType.DEVICE_MSG_TYPE_CLIPBOARD:
            return None
        if len(data) < 5:
            # at least type + empty string length
            return None
        clipboard_len: int = struct.unpack(">I", data[1:5])[0]
        if clipboard_len > len(data) - 5:
            return None
        return data[5:].decode("utf-8")

class SetClipboardEvent:
    msg_type: ControlMsgType = ControlMsgType.MSG_TYPE_SET_CLIPBOARD
    sequence: int = 0 # 8
    paste: int = 0 # 1

    def __init__(self, text: str) -> None:
        self.text = bytes(text, encoding="utf-8")

    def serialize(self) -> bytes:
        buf = struct.pack(
            ">BQBI",
            self.msg_type.value,
            self.sequence,
            self.paste,
            len(self.text),
        )
        buf += self.text
        return buf
