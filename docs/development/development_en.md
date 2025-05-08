# Development

Clone this repo:

```bash
git clone https://github.com/BHznJNs/InputShare
cd InputShare
```

Install the requirements with:

```bash
pip install -r requirements.txt
```

Run the entry script:

```bash
python main.py
```

If you want to build this project by yourself, go on:

## Build

Install the pyinstaller:

```bash
pip install pyinstaller
```

Get the `customtkinter` library path

```bash
pip show customtkinter
```

A Location will be shown, for example: `c:\users\<user_name>\appdata\local\programs\python\python310\lib\site-packages`

Use this command to build (replace `<CustomTkinter Location>` with `customtkinter` library path got above):

For Bash:
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

For PowerShell:
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
