# Desarrollo

Clone este repositorio:

```bash
git clone https://github.com/BHznJNs/InputShare
cd InputShare
```

Instale los requisitos con:

```bash
pip install -r requirements.txt
```

Ejecute el script de entrada:

```bash
python main.py
```

Si desea construir este proyecto usted mismo, continúe:

## Construcción

Instale pyinstaller:

```bash
pip install pyinstaller
```

Obtenga la ruta de la biblioteca `customtkinter`:

```bash
pip show customtkinter
```

Se mostrará una ubicación, por ejemplo: `c:\users\<user_name>\appdata\local\programs\python\python310\lib\site-packages`

Use este comando para construir (reemplace `<CustomTkinter Location>` con la ruta de la biblioteca `customtkinter` obtenida anteriormente):

Para Bash:
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

Para PowerShell:
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
