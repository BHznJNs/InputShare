import socket
import threading
import time

import sounddevice as sd

from utils import VoidCallable
from utils.logger import LOGGER, LogType

# scrcpy raw audio format: 48kHz, stereo, signed 16-bit LE PCM
SAMPLE_RATE = 48000
CHANNELS = 2
BYTES_PER_SAMPLE = 2
FRAME_BYTES = CHANNELS * BYTES_PER_SAMPLE

# Cap how much audio we allow to queue up. Keeping this small means a
# stall (e.g. the device sleeping, then dumping a backlog on wake) gets
# trimmed back to "live" instead of playing out as growing lag.
MAX_BUFFER_MS = 150
MAX_BUFFER_BYTES = int(SAMPLE_RATE * MAX_BUFFER_MS / 1000) * FRAME_BYTES

CHUNK_READ_SIZE = 4096

# If no audio arrives for this long, treat the next chunk as stale/post-sleep
# backlog and flush the buffer instead of playing out accumulated lag.
STALE_GAP_SECONDS = 0.5


def audio_player_factory(audio_socket: socket.socket) -> VoidCallable:
    buffer = bytearray()
    buffer_lock = threading.Lock()
    stop_event = threading.Event()

    def callback(outdata, frames, time_info, status):
        needed = frames * FRAME_BYTES
        with buffer_lock:
            available = len(buffer)
            if available >= needed:
                chunk = bytes(buffer[:needed])
                del buffer[:needed]
            else:
                # underrun: play what we have, pad the rest with silence
                chunk = bytes(buffer) + b"\x00" * (needed - available)
                buffer.clear()
        outdata[:] = chunk

    stream = sd.RawOutputStream(
        samplerate=SAMPLE_RATE,
        channels=CHANNELS,
        dtype="int16",
        callback=callback,
    )

    def reader_loop():
        last_recv_time = time.monotonic()
        try:
            stream.start()
            while not stop_event.is_set():
                data = audio_socket.recv(CHUNK_READ_SIZE)
                if not data:
                    LOGGER.write(LogType.Server, "Audio socket closed by server.")
                    break

                now = time.monotonic()
                gap = now - last_recv_time
                last_recv_time = now

                with buffer_lock:
                    if gap > STALE_GAP_SECONDS:
                        # Tablet was likely asleep — this data is stale/backlogged.
                        # Drop whatever's queued and start fresh rather than
                        # playing out a growing backlog.
                        LOGGER.write(LogType.Server, f"Audio gap of {gap:.2f}s detected, flushing buffer.")
                        buffer.clear()

                    buffer.extend(data)
                    # Normal jitter-smoothing cap, unrelated to the sleep case.
                    # Trim only whole frames so channels never desync.
                    excess = len(buffer) - MAX_BUFFER_BYTES
                    if excess > 0:
                        excess -= excess % FRAME_BYTES
                        if excess > 0:
                            del buffer[:excess]
        except (ConnectionAbortedError, ConnectionResetError, OSError) as e:
            LOGGER.write(LogType.Error, "Audio connection error: " + str(e))
        except Exception as e:
            LOGGER.write(LogType.Error, "Audio player error: " + str(e))
        finally:
            try:
                stream.stop()
                stream.close()
            except Exception:
                pass
            LOGGER.write(LogType.Server, "Audio player stopped.")

    thread = threading.Thread(target=reader_loop, daemon=True)
    thread.start()

    def stop_player():
        stop_event.set()
        try:
            audio_socket.close()
        except Exception:
            pass
        thread.join(timeout=2)

    return stop_player