import multiprocessing

def is_child_process() -> bool:
    return multiprocessing.current_process().name != "MainProcess"

def current_process_name() -> str:
    return multiprocessing.current_process().name
