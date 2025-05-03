[Languages]
Name: "en"; MessagesFile: "compiler:Default.isl"
Name: "zh_CN"; MessagesFile: ".\src\assets\ChineseSimplified.isl"

[Setup]
AppName="InputShare"
AppVersion=0.9.0
DefaultDirName={userappdata}\InputShare
DefaultGroupName="InputShare"
OutputDir=.\
OutputBaseFilename=InputShare_setup
Compression=lzma
SolidCompression=yes
PrivilegesRequired=lowest

[Files]
Source: "main.dist\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\InputShare"; Filename: "{app}\main.exe"

[Run]
Filename: "{app}\main.exe"; Description: "Launch InputShare"; Flags: nowait postinstall skipifsilent
