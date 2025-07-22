import itertools
import selectors
import socket
import concurrent.futures
from concurrent.futures import Future, ThreadPoolExecutor
from typing import cast
from utils.logger import LOGGER, LogType

DEFAULT_START_PORT = 32000
DEFAULT_END_PORT = 47000
DEFAULT_STEP = 512
DEFAULT_CONNECT_TIMEOUT = 1.2

def test_batch_port(ip: str, start_port: int, end_port: int) -> int | None:
    selector = selectors.DefaultSelector()

    for port in range(start_port, end_port):
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.setblocking(False)
        sock.connect_ex((ip, port))
        selector.register(sock, selectors.EVENT_WRITE)

    events = selector.select(timeout=DEFAULT_CONNECT_TIMEOUT)
    port = None
    for event_key, _ in events:
        target_sock = cast(socket.socket, event_key.fileobj)
        _, port = target_sock.getpeername()
        selector.unregister(target_sock)
        target_sock.close()
    selector.close()
    if port is not None: return port

def scan_port(ip: str) -> list[int]:
    executor = ThreadPoolExecutor(max_workers=4)
    futures: list[Future[int | None]] = [
        executor.submit(test_batch_port, ip, i, min(DEFAULT_END_PORT, i + DEFAULT_STEP))
        for i in range(DEFAULT_START_PORT, DEFAULT_END_PORT, DEFAULT_STEP)
    ]
    future_it = iter(futures)
    target_ports: list[int] = []
    for future1, future2 in zip(future_it, future_it):
        try:
            for future in concurrent.futures.as_completed([future1, future2]):
                result = future.result()
                if result is None: continue
                target_ports.append(result)
        except Exception as e:
            LOGGER.write(LogType.Error, "Port scanning error: " + str(e))
    executor.shutdown(cancel_futures=True)
    return target_ports
