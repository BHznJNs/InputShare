# التطوير

استنسخ هذا المستودع:

```bash
git clone https://github.com/BHznJNs/InputShare
cd InputShare
```

قم بتثبيت المتطلبات باستخدام:

```bash
pip install -r requirements.txt
```

قم بتشغيل السكريبت الرئيسي:

```bash
python main.py
```

إذا كنت ترغب في بناء هذا المشروع بنفسك، فتابع:

## البناء

قم بتثبيت pyinstaller:

```bash
pip install pyinstaller
```

احصل على مسار مكتبة `customtkinter`:

```bash
pip show customtkinter
```

سيتم عرض موقع، على سبيل المثال: `c:\users\<user_name>\appdata\local\programs\python\python310\lib\site-packages`

استخدم هذا الأمر للبناء (استبدل `<CustomTkinter Location>` بمسار مكتبة `customtkinter` الذي حصلت عليه أعلاه):

لـ Bash:
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

لـ PowerShell:
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
