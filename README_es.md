<div align="center">
    <br />
    <img src="./ui/icon.png" alt="InputShare Logo" width="160" height="160" />
    <h1>InputShare</h1>
    <a href="README_zh.md">中文介绍</a> |
    <a href="README.md">English</a> |
    <a href="README_ja.md">日本語</a> |
    <a href="README_fr.md">Français</a> |
    <a href="README_es.md">Español</a> |
    <a href="README_ru.md">Русский</a> |
    <a href="README_ar.md">العربية</a> <br>
    <a href="https://bhznjns.github.io/InputShare/">Homepage</a> |
    <a href="https://github.com/BHznJNs/InputShare/issues">Feedback</a> |
    <a href="https://discord.gg/BwHCxUwnYw">Discord</a>
    <br />
    <br />
</div>

__InputShare__ le permite compartir el teclado y el ratón de su ordenador con un dispositivo Android a través de ADB de forma cableada o inalámbrica.

## Características

- __Cambio sin interrupciones__: Cambie rápidamente la entrada de teclado y ratón entre el PC y el dispositivo Android a través de una tecla de acceso rápido y la alternancia de bordes.
- __Conexión cableada / inalámbrica__: Admite conexiones tanto cableadas como inalámbricas para un uso compartido de entrada flexible.
- __Amplia compatibilidad__: Compatible con varios dispositivos Android, no con una marca específica.
- __Sincronización del portapapeles__: Sincronice sin problemas el contenido del portapapeles entre su ordenador y su dispositivo Android.
- __Interfaz gráfica fácil de usar__

## Capturas de pantalla

| Emparejamiento | Conectando | Configuración | Bandeja del sistema |
| --- | --- | --- | --- |
| ![Interfaz de emparejamiento](./docs/screenshots/pairing_en.png) | ![Interfaz de conexión](./docs/screenshots/connecting_en.png) | ![Configuración](./docs/screenshots/Settings_en.png) | ![Bandeja del sistema](./docs/screenshots/tray_selections_en.png) |

## Instalación

Vaya a la [página de versiones](https://github.com/BHznJNs/InputShare/releases) y descargue el último paquete comprimido, descomprímalo y el ejecutable estará dentro.

## Uso

Primero debe habilitar la __Configuración de desarrollador__ de su dispositivo Android.

Para conexión cableada:

1. Habilite la __Depuración USB__ en la página __Configuración de desarrollador__.
2. Conecte su dispositivo al ordenador a través de un cable USB.
3. Simplemente ejecute el ejecutable y omita los pasos de emparejamiento y conexión.
4. Disfrute de su ratón y teclado en el dispositivo Android.

Para conexión inalámbrica:

1. Habilite la __Depuración inalámbrica__ en la página Configuración de desarrollador.
2. Ejecute el ejecutable.
3. En su dispositivo Android: Abra la opción __Emparejar dispositivo con código de emparejamiento__ e introduzca la dirección IP, el puerto y el código de emparejamiento en la pestaña de emparejamiento de la ventana de conexión (Este es el paso de emparejamiento que generalmente se necesita para el primer uso).
4. Introduzca la dirección IP y el puerto de la __Depuración inalámbrica__ principal en la pestaña de conexión de la ventana de conexión.
5. Disfrute de su ratón y teclado en el dispositivo Android.

## Documentación del usuario

- [Atajos](./docs/shortcuts_es.md)
- [Preguntas frecuentes](./docs/faqs_es.md)
- [Limitaciones](./docs/limitations_es.md)
- [Desarrollo](./docs/development_es.md)

## Agradecimientos

InputShare se basa en el proyecto [scrcpy](https://github.com/Genymobile/scrcpy) y proporciona una interfaz gráfica con la invocación de ADB incorporada.

Gracias a [@yxyh357](https://github.com/yxyh357), quien mejoró el rendimiento de InputShare bajo una alta tasa de sondeo.
