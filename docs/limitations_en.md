# Known Limitations

## Connection Disconnects After Device Screen Turns Off

After the program successfully connects, if either the computer or Android device turns off the screen, the connection will be lost. To continue using the program, it is necessary to restart it and reconnect.

**Solution**: The program currently offers a "Keep Screen On" setting, which can prevent the Android device from turning off the screen, thus mitigating this limitation.

## After sharing the keyboard and mouse, the mouse cursor on my Android device becomes erratic. How can I fix this?

You can try adjusting the "report rate" (also referred to as "polling rate" in some cases) of your mouse through its driver software (e.g., Logitech G Hub, Razer Synapse, etc.) to 125Hz or a similar value. This should significantly improve the situation.

## Conflict with other softwares that use ADB

If you use this software while using any software that rely on ADB to connect to your Android device (such as Android Studio), you may encounter a situation where this software cannot successfully connect to Android device. Similarly, the Android device you connect using this software cannot be connected by other software using ADB.
This is a limitation of ADB itself, there is no solution currently.

## Conflict with Bonjour

Some similar software, such as [barrier](https://github.com/debauchee/barrier) and [deskflow](https://github.com/deskflow/deskflow), use [Bonjour](https://developer.apple.com/bonjour/) to simplify network connections. However, based on feedback from some users, when running barrier and starting Bonjour on the computer, and then using this software, the connection success rate of this software is significantly reduced.

**Solution**: The exact cause of the conflict between this software and Bonjour is still unknown. You can try connecting with this software first, and then start barrier to avoid this issue.
