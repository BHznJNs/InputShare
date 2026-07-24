import socket
import threading

import sounddevice as sd

from utils import VoidCallable
from utils.logger import LOGGER, LogType

# scrcpy raw audio format (see AudioCapture.java): 48kHz, stereo, signed 16-bit LE PCM
SAMPLE_RATE = 48000
CHANNELS = 2
BYTES_PER_SAMPLE = 2
FRAME_BYTES = CHANNELS * BYTES_PER_SAMPLE
RECV_BUFFER_SIZE = 4096

def audio_player_factory(audio_socket: socket.socket) -> VoidCallable:
    stream = sd.RawOutputStream(
        samplerate=SAMPLE_RATE,
        channels=CHANNELS,
        dtype="int16",
        blocksize=0,   # let PortAudio pick its optimal block size
        latency="low",
    )

    def player_loop():
        # a TCP read can end in the middle of a frame, while the output stream
        # only accepts whole frames; the partial tail is kept for the next write
        # to prevent the channels from being permanently swapped
        residual = b""
        try:
            stream.start()
            while True:
                data = audio_socket.recv(RECV_BUFFER_SIZE)
                if len(data) == 0:
                    LOGGER.write(LogType.Server, "Scrcpy server closed audio connection.")
                    break
                data = residual + data
                aligned_size = len(data) - len(data) % FRAME_BYTES
                residual = data[aligned_size:]
                if aligned_size > 0:
                    stream.write(data[:aligned_size])
        except (ConnectionAbortedError, ConnectionResetError, OSError) as e:
            LOGGER.write(LogType.Error, "Audio connection error: " + str(e))
        except Exception as e:
            LOGGER.write(LogType.Error, "Audio playing error: " + str(e))
        finally:
            try:
                stream.stop()
                stream.close()
            except Exception as e:
                LOGGER.write(LogType.Error, "Audio stream closing error: " + str(e))
        LOGGER.write(LogType.Server, "Audio player stopped.")

    def stop_player():
        nonlocal audio_socket, thread
        audio_socket.close()
        thread.join()

    thread = threading.Thread(target=player_loop)
    thread.start()
    return stop_player
