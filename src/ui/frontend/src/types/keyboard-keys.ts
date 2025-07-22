export enum KeyboardKey {
  // Letters
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  E = "E",
  F = "F",
  G = "G",
  H = "H",
  I = "I",
  J = "J",
  K = "K",
  L = "L",
  M = "M",
  N = "N",
  O = "O",
  P = "P",
  Q = "Q",
  R = "R",
  S = "S",
  T = "T",
  U = "U",
  V = "V",
  W = "W",
  X = "X",
  Y = "Y",
  Z = "Z",

  // Numbers
  Zero = "0",
  One = "1",
  Two = "2",
  Three = "3",
  Four = "4",
  Five = "5",
  Six = "6",
  Seven = "7",
  Eight = "8",
  Nine = "9",

  // Function Keys
  F1 = "F1",
  F2 = "F2",
  F3 = "F3",
  F4 = "F4",
  F5 = "F5",
  F6 = "F6",
  F7 = "F7",
  F8 = "F8",
  F9 = "F9",
  F10 = "F10",
  F11 = "F11",
  F12 = "F12",

  // Modifier Keys
  Shift = "Shift",
  Control = "Control",
  Alt = "Alt",
  Meta = "Meta", // Windows key, Command key

  // Navigation Keys
  ArrowUp = "ArrowUp",
  ArrowDown = "ArrowDown",
  ArrowLeft = "ArrowLeft",
  ArrowRight = "ArrowRight",
  Home = "Home",
  End = "End",
  PageUp = "PageUp",
  PageDown = "PageDown",

  // Other Common Keys
  Enter = "Enter",
  Escape = "Escape",
  Tab = "Tab",
  Space = " ",
  Backspace = "Backspace",
  Delete = "Delete",
  Insert = "Insert",

  // Punctuation and Symbols (Common)
  Comma = ",",
  Period = ".",
  Slash = "/",
  Backslash = "\\",
  Semicolon = ";",
  Quote = '"',
  BracketLeft = "[",
  BracketRight = "]",
  Backquote = "`",
  Minus = "-",
  Equal = "=",

  // Numpad Keys
  Numpad0 = "Numpad0",
  Numpad1 = "Numpad1",
  Numpad2 = "Numpad2",
  Numpad3 = "Numpad3",
  Numpad4 = "Numpad4",
  Numpad5 = "Numpad5",
  Numpad6 = "Numpad6",
  Numpad7 = "Numpad7",
  Numpad8 = "Numpad8",
  Numpad9 = "Numpad9",
  NumpadMultiply = "NumpadMultiply",
  NumpadAdd = "NumpadAdd",
  NumpadSubtract = "NumpadSubtract",
  NumpadDecimal = "NumpadDecimal",
  NumpadDivide = "NumpadDivide",

  // Lock Keys
  CapsLock = "CapsLock",
  ScrollLock = "ScrollLock",
  NumLock = "NumLock",

  // Other
  PrintScreen = "PrintScreen",
  Pause = "Pause",
}

export function resolveKeyboardEvent(event: KeyboardEvent): KeyboardKey | null {
  const keyValues = Object.values(KeyboardKey)
  const predicator = (keyValue: KeyboardKey) =>
    event.key === keyValue || event.key.toUpperCase() === keyValue
  return keyValues.find(predicator) || null
}
