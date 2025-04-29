import socket

class NoUsablePortException(Exception): pass

MAXIMUM_PORT = 65535

def check_tcp_port_usable(port: int, host="127.0.0.1") -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            s.bind((host, port))
        except OSError:
            return False
        return True

def find_available_port(start_port: int, end_port=MAXIMUM_PORT, host="127.0.0.1") -> int:
    for port in range(start_port, end_port + 1):
        if check_tcp_port_usable(port, host=host):
            return port
    raise NoUsablePortException()
