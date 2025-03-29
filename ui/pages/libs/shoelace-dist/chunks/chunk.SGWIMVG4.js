import {
  registerTranslation
} from "./chunk.TDEXDIPB.js";

// src/translations/de.ts
var translation = {
  $code: "de",
  $name: "Deutsch",
  $dir: "ltr",
  carousel: "Karussell",
  clearEntry: "Eingabe l\xF6schen",
  close: "Schlie\xDFen",
  copied: "Kopiert",
  copy: "Kopieren",
  currentValue: "Aktueller Wert",
  error: "Fehler",
  goToSlide: (slide, count) => `Zu Folie ${slide} von ${count} gehen`,
  hidePassword: "Passwort verbergen",
  loading: "Wird geladen",
  nextSlide: "N\xE4chste Folie",
  numOptionsSelected: (num) => {
    if (num === 0) return "Keine Optionen ausgew\xE4hlt";
    if (num === 1) return "1 Option ausgew\xE4hlt";
    return `${num} Optionen ausgew\xE4hlt`;
  },
  previousSlide: "Vorherige Folie",
  progress: "Fortschritt",
  remove: "Entfernen",
  resize: "Gr\xF6\xDFe \xE4ndern",
  scrollToEnd: "Zum Ende scrollen",
  scrollToStart: "Zum Anfang scrollen",
  selectAColorFromTheScreen: "Farbe vom Bildschirm ausw\xE4hlen",
  showPassword: "Passwort anzeigen",
  slideNum: (slide) => `Folie ${slide}`,
  toggleColorFormat: "Farbformat umschalten"
};
registerTranslation(translation);
var de_default = translation;

export {
  de_default
};
