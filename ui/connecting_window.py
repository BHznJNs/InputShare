import sys
import threading
import customtkinter as ctk

from dataclasses import dataclass, asdict
from queue import Queue
from ui import ICON_ICO_PATH, ICON_PNG_PATH
from utils.adb_controller import get_adb_client, try_connect_device, try_pairing
from utils.config_manager import ConfigFile, get_config, get_config_manager
from utils.logger import LOGGER, LogType, unreachable
from utils.network import get_ip_from_ip_port, is_valid_ip, is_valid_ip_port, scan_port
from utils.i18n import get_i18n

i18n = get_i18n()
is_wired_connection = False

def mount_pairing_view(tabview: ctk.CTkTabview, connecting_addr_entry: ctk.CTkEntry):
    def pair_callback():
        global connecting_window
        nonlocal addr_entry, pairing_code_entry, error_label
        error_label.configure(text="")

        addr = addr_entry.get().strip()
        pairing_code = pairing_code_entry.get().strip()
        if not is_valid_ip_port(addr):
            error_label.configure(text=i18n(["Invalid pairing address!", "配对地址无效！"]))
            return
        ret = try_pairing(addr, pairing_code)
        if not ret:
            error_label.configure(text=i18n(["Pairing Failed!", "配对失败！"]))
            return
        device_ip = get_ip_from_ip_port(addr)
        connecting_addr_entry.delete(0, ctk.END)
        connecting_addr_entry.insert(0, device_ip)
        tabview.set(i18n(["Connecting", "连接"]))
        connecting_window.deiconify()
        connecting_window.focus()

    def need_not_pairing_callback():
        nonlocal tabview
        tabview.set(i18n(["Connecting", "连接"]))
    
    def validate_entry(text: str):
        text_len = len(text)
        return text_len == 0 or\
            text.isdigit() and\
            text_len <= 6

    frame = tabview.tab(i18n(["Pairing", "配对"]))
    vcmd = (tabview.register(validate_entry), "%P")
    normal_font = i18n([ctk.CTkFont(family="Arial", size=16), ctk.CTkFont(family="Microsoft YaHei", size=16)])
    larger_font = i18n([ctk.CTkFont(family="Arial", size=18), ctk.CTkFont(family="Microsoft YaHei", size=18)])

    prompt_label1 = ctk.CTkLabel(
        master=frame, font=larger_font,
        text=i18n(["Wireless debugging pairing IP address and port:", "无线调试配对 IP 地址和端口：                "]))
    prompt_label2 = ctk.CTkLabel(
        master=frame, font=larger_font,
        text=i18n(["Wireless debugging pairing code:", "无线调试配对码："]))
    error_label = ctk.CTkLabel(
        master=frame,
        text="",
        text_color="red",
        font=larger_font)
    addr_entry = ctk.CTkEntry(
        master=frame,
        font=normal_font)
    pairing_code_entry = ctk.CTkEntry(
        master=frame,
        font=normal_font,
        validate="key",
        validatecommand=vcmd)

    prompt_label1.grid(row=0, column=0, padx=20, pady=(10, 4), sticky="w")
    addr_entry.grid(row=1, column=0, padx=20, sticky="we")
    prompt_label2.grid(row=2, column=0, padx=20, pady=(10, 4), sticky="w")
    pairing_code_entry.grid(row=3, column=0, padx=20, sticky="we")
    error_label.grid(row=4, column=0, padx=20, pady=(10, 4), sticky="w")

    button_frame = ctk.CTkFrame(master=frame)
    skip_button = ctk.CTkButton(
        master=button_frame,
        text=i18n(["Paired? Skip >", "已配对？跳过"]),
        font=normal_font,
        command=need_not_pairing_callback)
    pair_button = ctk.CTkButton(
        master=button_frame,
        text=i18n(["Pair", "配对"]),
        font=normal_font,
        command=pair_callback)
    button_frame.grid(row=6, column=0, padx=20, pady=10, sticky="we")
    skip_button.pack(side=ctk.LEFT)
    pair_button.pack(side=ctk.RIGHT)

def mount_connecting_view(tabview: ctk.CTkTabview) -> ctk.CTkEntry:
    @dataclass
    class ProcessOk: ip_port_str: str
    @dataclass
    class ProcessError: msg: str

    process_data_queue: Queue[ProcessOk | ProcessError] = Queue()

    def scan_and_connect(addr: str):
        nonlocal process_data_queue
        valid_ip = is_valid_ip(addr)
        valid_ip_port = is_valid_ip_port(addr)
        if not valid_ip and not valid_ip_port:
            process_data_queue.put(
                ProcessError(i18n(["Invalid connecting address!", "连接地址无效！"])))
            return
        # format address string into ip_part only string
        ip_addr_part = addr if valid_ip else get_ip_from_ip_port(addr)

        target_ports = scan_port(ip_addr_part)
        for port in target_ports:
            connect_addr = f"{ip_addr_part}:{port}"
            ret = try_connect_device(connect_addr)
            if ret is not None:
                process_data_queue.put(ProcessOk(connect_addr))
                return
        LOGGER.write(LogType.Error, "Scanned ports: " + str(target_ports))
        process_data_queue.put(
            ProcessError(i18n(["Port scanning failed,\nplease check the IP address.", "扫描端口失败，请检查 IP 地址是否正确。"])))

    def direct_connect(addr: str):
        nonlocal process_data_queue
        if not is_valid_ip_port(addr):
            process_data_queue.put(
                ProcessError(i18n(["Invalid connecting address!", "连接地址无效！"])))
            return
        ret = try_connect_device(addr)
        if ret is not None:
            process_data_queue.put(ProcessOk(addr))
            return
        process_data_queue.put(
            ProcessError(i18n(["Connecting failed, please retry.", "连接失败，请重试。"])))

    def process_ip_port(addr: str, to_scan_port: bool):
        if to_scan_port: scan_and_connect(addr)
        else: direct_connect(addr)

    def process_callback():
        global connecting_window
        nonlocal process_data_queue, auto_scan_port,\
                 error_label, waiting_label
        if process_data_queue.empty():
            # wait for ip_port data processed
            connecting_window.after(func=process_callback, ms=100)
            return

        result = process_data_queue.get()
        if type(result) == ProcessError:
            error_label.configure(text=result.msg)
            waiting_label.configure(text="")
            connecting_window.configure(cursor="arrow")
            enable_widgets()
        elif type(result) == ProcessOk:
            get_config().scan_port = bool(auto_scan_port.get())
            get_config().device_ip1 = get_ip_from_ip_port(result.ip_port_str)
            connecting_window.destroy()
        else: unreachable("Connection result: " + str(result))

    def enable_widgets():
        nonlocal addr_entry, auto_scan_port, skip_button, connect_button
        for wid in [addr_entry, auto_scan_port, skip_button, connect_button]:
            wid.configure(state="normal")

    def disable_widgets():
        nonlocal addr_entry, auto_scan_port, skip_button, connect_button
        for wid in [addr_entry, auto_scan_port, skip_button, connect_button]:
            wid.configure(state="disabled")

    def connect_callback():
        global connecting_window
        nonlocal addr_entry, auto_scan_port, error_label, waiting_label
        error_label.configure(text=""); error_label.update()
        waiting_label.configure(text=i18n(["Connecting, may take some time...", "连接中，可能需要一些时间..."])); waiting_label.update()

        disable_widgets()
        connecting_window.configure(cursor="watch")

        adb_addr = addr_entry.get().strip()
        to_scan_port = bool(auto_scan_port.get())
        threading.Thread(target=process_ip_port, args=[adb_addr, to_scan_port]).start()
        connecting_window.after(func=process_callback, ms=100)

    def need_not_connection_callback():
        global is_wired_connection
        is_wired_connection = True
        connecting_window.destroy()

    normal_font = i18n([ctk.CTkFont(family="Arial", size=16), ctk.CTkFont(family="Microsoft YaHei", size=16)])
    larger_font = i18n([ctk.CTkFont(family="Arial", size=18), ctk.CTkFont(family="Microsoft YaHei", size=18)])

    frame = tabview.tab(i18n(["Connecting", "连接"]))
    prompt_label = ctk.CTkLabel(
        master=frame, font=larger_font,
        text=i18n(["Wireless debugging IP address and port:    ", "无线调试 IP 地址和端口：                       "]))
    addr_entry = ctk.CTkEntry(
        master=frame,
        font=normal_font)
    error_label = ctk.CTkLabel(
        master=frame,
        text="",
        font=larger_font,
        text_color="red",
        justify="left")
    auto_scan_port = ctk.CTkCheckBox(
        master=frame, font=normal_font,
        text=i18n(["Auto detect port", "自动检测端口"]))
    waiting_label = ctk.CTkLabel(master=frame, text="", font=normal_font)

    addr_entry.insert(0, get_config().device_ip1)
    if get_config().scan_port: auto_scan_port.select()

    prompt_label.grid(row=0, column=0, padx=20, pady=(10, 4), sticky="w")
    addr_entry.grid(row=1, column=0, padx=20, sticky="we")
    auto_scan_port.grid(row=2, column=0, padx=20, pady=(10, 4), sticky="w")
    error_label.grid(row=3, column=0, padx=20, pady=(10, 4), sticky="w",)
    waiting_label.grid(row=4, column=0, padx=20, pady=2, sticky="w")

    button_frame = ctk.CTkFrame(master=frame)
    skip_button = ctk.CTkButton(
        master=button_frame,
        text=i18n(["Wired? Skip >", "有线连接？跳过"]),
        font=normal_font,
        command=need_not_connection_callback)
    connect_button = ctk.CTkButton(
        master=button_frame,
        text=i18n(["Connect", "连接"]),
        font=normal_font,
        command=connect_callback)
    button_frame.grid(row=5, column=0, padx=20, pady=10, sticky="we")
    skip_button.pack(side=ctk.LEFT)
    connect_button.pack(side=ctk.RIGHT)
    # expose the addr_entry to mainwindow
    return addr_entry

def open_connecting_window() -> bool:
    global connecting_window, is_wired_connection
    is_wired_connection = False

    def delete_window_callback():
        connecting_window.destroy()
        get_adb_client().server_kill()
        LOGGER.write(LogType.Adb, "ADB server killed.")
        sys.exit(0)

    connecting_window = ctk.CTk()
    connecting_window.iconbitmap(ICON_ICO_PATH)
    connecting_window.wm_title(i18n(["InputShare Connection", "输入流转 —— 连接"]))
    connecting_window.geometry("500x320")
    connecting_window.resizable(width=False, height=False)

    tabview = ctk.CTkTabview(master=connecting_window)
    tabview.add(i18n(["Pairing", "配对"]))
    tabview.add(i18n(["Connecting", "连接"]))
    tabview.pack()

    connecting_addr_entry = mount_connecting_view(tabview)
    mount_pairing_view(tabview, connecting_addr_entry)

    if get_config_manager().is_first_use:
        tabview.set(i18n(["Connecting", "连接"]))

    connecting_window.protocol("WM_DELETE_WINDOW", delete_window_callback)
    connecting_window.mainloop()
    return is_wired_connection

from PyQWebWindow import QAppManager, QWebWindow
def open_connecting_window_() -> bool:
    is_wired_connection = False
    def set_is_wired_connection():
        nonlocal is_wired_connection
        is_wired_connection = True
    def is_first_use() -> bool:
        return get_config_manager().is_first_use
    def config() -> dict:
        return asdict(get_config())

    app = QAppManager(debugging=True)
    window = QWebWindow(
        title=i18n(["InputShare Connection", "输入流转 —— 连接"]),
        icon=str(ICON_ICO_PATH.absolute()))
    window.register_bindings([
        set_is_wired_connection,
        is_first_use, config,
    ])
    window.load_file("./pages/connect.html")
    window.start()
    app.exec()
    return is_wired_connection
