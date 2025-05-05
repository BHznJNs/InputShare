# Développement

Clonez ce dépôt :

```bash
git clone https://github.com/BHznJNs/InputShare
cd InputShare
```

Installez les dépendances avec :

```bash
pip install -r requirements.txt
```

Exécutez le script d'entrée :

```bash
python main.py
```

Si vous voulez construire ce projet vous-même, continuez :

## Construction

Installez pyinstaller :

```bash
pip install pyinstaller
```

Obtenez le chemin de la bibliothèque `customtkinter` :

```bash
pip show customtkinter
```

Un emplacement sera affiché, par exemple : `c:\users\<user_name>\appdata\local\programs\python\python310\lib\site-packages`

Utilisez cette commande pour construire (remplacez `<CustomTkinter Location>` par le chemin de la bibliothèque `customtkinter` obtenu ci-dessus) :

Pour Bash :
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

Pour PowerShell :
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
