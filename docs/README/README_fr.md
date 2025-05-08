<div align="center">
    <br />
    <img src="./src/ui/icon.png" alt="InputShare Logo" width="160" height="160" />
    <h1>InputShare</h1>
    <a href="README_zh.md">中文介绍</a> |
    <a href="../../README.md">English</a> |
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

__InputShare__ vous permet de partager le clavier et la souris de votre ordinateur avec un appareil Android via ADB en mode filaire ou sans fil.

## Fonctionnalités

- __Commutation transparente__: Basculez rapidement l'entrée clavier et souris entre le PC et l'appareil Android via un raccourci clavier et un basculement de bord.
- __Connexion filaire / sans fil__: Prend en charge les connexions filaires et sans fil pour un partage d'entrée flexible.
- __Large compatibilité__: Compatible avec divers appareils Android, pas une marque spécifique.
- __Synchronisation du presse-papiers__: Synchronisez de manière transparente le contenu du presse-papiers entre votre ordinateur et votre appareil Android.
- __Interface graphique facile à utiliser__

## Captures d'écran

| Appairage | Connexion | Paramètres | Barre d'état système |
| --- | --- | --- | --- |
| ![Interface d'appairage](./docs/screenshots/pairing_en.png) | ![Interface de connexion](./docs/screenshots/connecting_en.png) | ![Paramètres](./docs/screenshots/Settings_en.png) | ![Barre d'état système](./docs/screenshots/tray_selections_en.png) |

## Installation

Allez sur la [page des versions](https://github.com/BHznJNs/InputShare/releases) et téléchargez le dernier package compressé, décompressez-le et l'exécutable s'y trouve.

## Utilisation

Vous devez d'abord activer les __Paramètres développeur__ de votre appareil Android.

Pour une connexion filaire :

1. Activez le __Débogage USB__ dans la page __Paramètres développeur__.
2. Connectez votre appareil à l'ordinateur via un câble USB.
3. Exécutez simplement l'exécutable et ignorez les étapes d'appairage et de connexion.
4. Profitez de votre souris et de votre clavier sur l'appareil Android.

Pour une connexion sans fil :

1. Activez le __Débogage sans fil__ dans la page Paramètres développeur.
2. Exécutez l'exécutable.
3. Sur votre appareil Android : Ouvrez l'option __Appairer l'appareil avec un code d'appairage__ et entrez l'adresse IP, le port et le code d'appairage dans l'onglet d'appairage de la fenêtre de connexion (C'est l'étape d'appairage qui est généralement nécessaire pour la première utilisation).
4. Entrez l'adresse IP et le port du __Débogage sans fil__ principal dans l'onglet de connexion de la fenêtre de connexion.
5. Profitez de votre souris et de votre clavier sur l'appareil Android.

## Documentation utilisateur

- [Raccourcis](../../shortcuts/shortcuts_fr.md)
- [FAQ](../../faqs/faqs_fr.md)
- [Limitations](../../limitations/limitations_fr.md)
- [Développement](../../development/development_fr.md)

## Remerciements

InputShare est basé sur le projet [scrcpy](https://github.com/Genymobile/scrcpy) et fournit une interface graphique avec l'invocation ADB intégrée.

Merci à [@yxyh357](https://github.com/yxyh357), qui a amélioré les performances d'InputShare sous un taux de polling élevé.
