# 开发

克隆此仓库：

```bash
git clone https://github.com/BHznJNs/InputShare
cd InputShare
```

安装依赖项：

```bash
pip install -r requirements.txt
```

运行入口文件：

```bash
python main.py
```

如果你想要自己构建这个项目，请继续阅读：

## 构建

安装 pyinstaller：

```bash
pip install pyinstaller
```

获取 `customtkinter` 库的路径

```bash
pip show customtkinter
```

这会输出一个类似于下面这样的路径： `c:\users\<user_name>\appdata\local\programs\python\python310\lib\site-packages`

然后你就可以使用这个命令来构建项目（替换 `<CustomTkinter Location>` 为上面获得的 `customtkinter` 库路径）：

对于 Bash:
```bash
pyinstaller \
    --windowed \
    --icon=ui/icon.ico \
    --add-data "./ui/icon.ico;ui/" \
    --add-data "./ui/icon.png;ui/" \
    --add-data "./adb-bin/;adb-bin/" \
    --add-data "./server/scrcpy-server;server/" \
    --add-data "./server/reporter.apk;server/" \
    --add-data "./build_venv/Lib/site-packages/customtkinter;customtkinter/" \
    --noconfirm main.py
```

对于 PowerShell:
```powershell
pyinstaller `
    --windowed `
    --icon=ui/icon.ico `
    --add-data "./ui/icon.ico;ui/" `
    --add-data "./ui/icon.png;ui/" `
    --add-data "./adb-bin/;adb-bin/" `
    --add-data "./server/scrcpy-server;server/" `
    --add-data "./server/reporter.apk;server/" `
    --add-data "./build_venv/Lib/site-packages/customtkinter;customtkinter/" `
    --noconfirm main.py
```
