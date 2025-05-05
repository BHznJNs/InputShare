import asyncio
import atexit
from multiprocessing import Process
from typing import Any, Callable, Iterable, TypeVar
from PyQWebWindow.ipc.MqIpc.server import IpcServer
from utils.network.port_check import find_available_port

_TaskResult = TypeVar("_TaskResult")

class WindowManager:
    _server: IpcServer
    _worker: Process

    @staticmethod
    def _initializer(debugging: bool, ipc_port: int):
        from PyQWebWindow.all import QAppManager, QWebWindow, IpcClient

        def run_task_handler(task: Callable[[IpcClient, Any], QWebWindow], *args):
            nonlocal window_pool
            if task in window_pool:
                window = window_pool[task]
                window.show()

            window = task(client, *args)
            window_pool[task] = window
            window.window.closed.connect(lambda: window_pool.pop(task))

        def exit_handler():
            nonlocal app, client
            client.stop()
            app.quit()

        app = QAppManager(debugging=debugging, auto_quit=False)
        window_pool: dict[Callable[[IpcClient, Any], QWebWindow], QWebWindow] = {}
        client = IpcClient(port=ipc_port)
        client.on("run-task", run_task_handler)
        client.on("process-exit", exit_handler)
        app.use_ipc_client(client)
        app.exec()

    @staticmethod
    def init(debugging: bool = False):
        ipc_port = find_available_port(5556)
        WindowManager._server = IpcServer(port=ipc_port)
        WindowManager._server.start()
        WindowManager._worker = Process(target=WindowManager._initializer, args=[debugging, ipc_port])
        WindowManager._worker.start()
        atexit.register(WindowManager.shutdown)

    @staticmethod
    def shutdown():
        WindowManager._server.emit("process-exit")
        WindowManager._worker.join()
        WindowManager._server.stop()

    @staticmethod
    def submit_and_wait(
        task: Callable,
        _t: _TaskResult,
        args: Iterable[Any] = [],
    ) -> _TaskResult:
        async def run_task() -> _TaskResult:
            loop = asyncio.get_running_loop()
            fut = loop.create_future()

            server = WindowManager._server
            server.emit("run-task", task, *args) # type: ignore
            server.once("task-completed",
                lambda res: loop.call_soon_threadsafe(fut.set_result, res)) # type: ignore
            return await fut
        return asyncio.run(run_task())

    @staticmethod
    def submit_and_then(
        task: Callable,
        callback: Callable[[_TaskResult], Any],
        args: Iterable[Any] = [],
    ):
        server = WindowManager._server
        server.emit("run-task", task, *args) # type: ignore
        server.once("task-completed", lambda res: callback(res))
