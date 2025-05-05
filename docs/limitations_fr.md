# Limitations connues

## La connexion se déconnecte après l'extinction de l'écran de l'appareil

Après que le programme se soit connecté avec succès, si l'ordinateur ou l'appareil Android éteint l'écran, la connexion sera perdue. Pour continuer à utiliser le programme, il est nécessaire de le redémarrer et de se reconnecter.

**Solution**: Le programme offre actuellement un paramètre "Garder l'écran allumé", qui peut empêcher l'appareil Android d'éteindre l'écran, atténuant ainsi cette limitation.

## Après avoir partagé le clavier et la souris, le curseur de la souris sur mon appareil Android devient erratique. Comment puis-je résoudre ce problème ?

Vous pouvez essayer d'ajuster le "taux de rapport" (également appelé "taux de polling" dans certains cas) de votre souris via son logiciel de pilote (par exemple, Logitech G Hub, Razer Synapse, etc.) à 125 Hz ou une valeur similaire. Cela devrait améliorer considérablement la situation.

## Conflit avec d'autres logiciels qui utilisent ADB

Si vous utilisez ce logiciel tout en utilisant un logiciel qui dépend d'ADB pour se connecter à votre appareil Android (tel qu'Android Studio), vous pouvez rencontrer une situation où ce logiciel ne peut pas se connecter avec succès à l'appareil Android. De même, l'appareil Android que vous connectez à l'aide de ce logiciel ne peut pas être connecté par d'autres logiciels utilisant ADB.
C'est une limitation d'ADB lui-même, il n'y a pas de solution actuellement.

## Conflit avec Bonjour

Certains logiciels similaires, tels que [barrier](https://github.com/debauchee/barrier) et [deskflow](https://github.com/deskflow/deskflow), utilisent [Bonjour](https://developer.apple.com/bonjour/) pour simplifier les connexions réseau. Cependant, selon les commentaires de certains utilisateurs, lors de l'exécution de barrier et du démarrage de Bonjour sur l'ordinateur, puis de l'utilisation de ce logiciel, le taux de réussite de la connexion de ce logiciel est considérablement réduit.

**Solution**: La cause exacte du conflit entre ce logiciel et Bonjour est encore inconnue. Vous pouvez essayer de vous connecter d'abord avec ce logiciel, puis démarrer barrier pour éviter ce problème.
