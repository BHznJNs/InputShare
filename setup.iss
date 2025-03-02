[Setup]
AppName=InputShare
AppVersion=0.7.6
DefaultDirName={userappdata}\InputShare
DefaultGroupName=InputShare
OutputDir=.\
OutputBaseFilename=InputShare_setup
Compression=lzma
SolidCompression=yes
PrivilegesRequired=lowest

[Files]
Source: "dist\main\main.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "dist\main\_internal\*"; DestDir: "{app}\_internal"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\InputShare"; Filename: "{app}\main.exe"

[Run]
Filename: "{app}\main.exe"; Description: "Launch InputShare"; Flags: nowait postinstall skipifsilent
