# Limitaciones conocidas

## La conexión se desconecta después de que la pantalla del dispositivo se apaga

Después de que el programa se conecta correctamente, si la computadora o el dispositivo Android apagan la pantalla, la conexión se perderá. Para continuar usando el programa, es necesario reiniciarlo y volver a conectarse.

**Solución**: El programa actualmente ofrece una configuración "Mantener pantalla encendida", que puede evitar que el dispositivo Android apague la pantalla, mitigando así esta limitación.

## Después de compartir el teclado y el ratón, el cursor del ratón en mi dispositivo Android se vuelve errático. ¿Cómo puedo solucionar esto?

Puede intentar ajustar la "tasa de informe" (también conocida como "tasa de sondeo" en algunos casos) de su ratón a través de su software de controlador (por ejemplo, Logitech G Hub, Razer Synapse, etc.) a 125 Hz o un valor similar. Esto debería mejorar significativamente la situación.

## Conflicto con otros softwares que usan ADB

Si usa este software mientras usa cualquier software que dependa de ADB para conectarse a su dispositivo Android (como Android Studio), puede encontrar una situación en la que este software no pueda conectarse correctamente al dispositivo Android. De manera similar, el dispositivo Android que conecta usando este software no puede ser conectado por otro software usando ADB.
Esta es una limitación de ADB en sí misma, actualmente no hay solución.

## Conflicto con Bonjour

Algunos softwares similares, como [barrier](https://github.com/debauchee/barrier) y [deskflow](https://github.com/deskflow/deskflow), usan [Bonjour](https://developer.apple.com/bonjour/) para simplificar las conexiones de red. Sin embargo, según los comentarios de algunos usuarios, al ejecutar barrier e iniciar Bonjour en la computadora, y luego usar este software, la tasa de éxito de la conexión de este software se reduce significativamente.

**Solución**: La causa exacta del conflicto entre este software y Bonjour aún se desconoce. Puede intentar conectarse primero con este software y luego iniciar barrier para evitar este problema.
