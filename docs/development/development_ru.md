# Разработка

Клонируйте этот репозиторий:

```bash
git clone https://github.com/BHznJNs/InputShare
cd InputShare
```

Установите требования с помощью:

```bash
pip install -r requirements.txt
```

Запустите входной скрипт:

```bash
python main.py
```

Если вы хотите собрать этот проект самостоятельно, продолжайте:

## Сборка

Установите pyinstaller:

```bash
pip install pyinstaller
```

Получите путь к библиотеке `customtkinter`:

```bash
pip show customtkinter
```

Будет показано местоположение, например: `c:\users\<user_name>\appdata\local\programs\python\python310\lib\site-packages`

Используйте эту команду для сборки (замените `<CustomTkinter Location>` на путь к библиотеке `customtkinter`, полученный выше):

Для Bash:
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

Для PowerShell:
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
