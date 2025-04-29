def get_ip_from_ip_port(ip_port_str: str) -> str:
    if ip_port_str.count(":") > 1:
        #   IPv6 address
        ip_part = ip_port_str.rsplit(":", 1)[0]
    else: # IPv4 address
        ip_part = ip_port_str.split(":")[0]
    return ip_part
