# 開発

このリポジトリをクローンします：

```bash
git clone https://github.com/BHznJNs/InputShare
cd InputShare
```

要件をインストールします：

```bash
pip install -r requirements.txt
```

エントリスクリプトを実行します：

```bash
python main.py
```

自分でこのプロジェクトをビルドしたい場合は、続けてください：

## ビルド

pyinstaller をインストールします：

```bash
pip install pyinstaller
```

`customtkinter`ライブラリのパスを取得します：

```bash
pip show customtkinter
```

場所が表示されます。例：`c:\users\<user_name>\appdata\local\programs\python\python310\lib\site-packages`

このコマンドを使用してビルドします（`<CustomTkinter Location>`を上記で取得した`customtkinter`ライブラリのパスに置き換えてください）：

Bash の場合：
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

PowerShell の場合：
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
