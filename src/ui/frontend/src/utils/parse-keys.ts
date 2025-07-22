import { KeyboardKey } from "../types/keyboard-keys"

// Mapping for single characters to KeyboardKey enum
const charToKeyboardKeyMap: { [key: string]: KeyboardKey } = {
    "a": KeyboardKey.A, "b": KeyboardKey.B, "c": KeyboardKey.C, "d": KeyboardKey.D, "e": KeyboardKey.E,
    "f": KeyboardKey.F, "g": KeyboardKey.G, "h": KeyboardKey.H, "i": KeyboardKey.I, "j": KeyboardKey.J,
    "k": KeyboardKey.K, "l": KeyboardKey.L, "m": KeyboardKey.M, "n": KeyboardKey.N, "o": KeyboardKey.O,
    "p": KeyboardKey.P, "q": KeyboardKey.Q, "r": KeyboardKey.R, "s": KeyboardKey.S, "t": KeyboardKey.T,
    "u": KeyboardKey.U, "v": KeyboardKey.V, "w": KeyboardKey.W, "x": KeyboardKey.X, "y": KeyboardKey.Y,
    "z": KeyboardKey.Z,
    "0": KeyboardKey.Zero, "1": KeyboardKey.One, "2": KeyboardKey.Two, "3": KeyboardKey.Three, "4": KeyboardKey.Four,
    "5": KeyboardKey.Five, "6": KeyboardKey.Six, "7": KeyboardKey.Seven, "8": KeyboardKey.Eight, "9": KeyboardKey.Nine,
    ",": KeyboardKey.Comma, ".": KeyboardKey.Period, "/": KeyboardKey.Slash, "\\": KeyboardKey.Backslash,
    ";": KeyboardKey.Semicolon, '"': KeyboardKey.Quote, "[": KeyboardKey.BracketLeft, "]": KeyboardKey.BracketRight,
    "`": KeyboardKey.Backquote, "-": KeyboardKey.Minus, "=": KeyboardKey.Equal, " ": KeyboardKey.Space
}

// Mapping for special key names (lowercase) to KeyboardKey enum
const specialKeyNameToKeyboardKeyMap: { [key: string]: KeyboardKey } = {
    "f1": KeyboardKey.F1, "f2": KeyboardKey.F2, "f3": KeyboardKey.F3, "f4": KeyboardKey.F4,
    "f5": KeyboardKey.F5, "f6": KeyboardKey.F6, "f7": KeyboardKey.F7, "f8": KeyboardKey.F8,
    "f9": KeyboardKey.F9, "f10": KeyboardKey.F10, "f11": KeyboardKey.F11, "f12": KeyboardKey.F12,
    "shift": KeyboardKey.Shift, "control": KeyboardKey.Control, "ctrl": KeyboardKey.Control,
    "alt": KeyboardKey.Alt, "cmd": KeyboardKey.Meta, // Assuming 'cmd' maps to 'Meta' (Windows/Command)
    "arrowup": KeyboardKey.ArrowUp, "arrowdown": KeyboardKey.ArrowDown,
    "arrowleft": KeyboardKey.ArrowLeft, "arrowright": KeyboardKey.ArrowRight,
    "home": KeyboardKey.Home, "end": KeyboardKey.End, "pageup": KeyboardKey.PageUp,
    "pagedown": KeyboardKey.PageDown, "enter": KeyboardKey.Enter, "escape": KeyboardKey.Escape,
    "tab": KeyboardKey.Tab, "backspace": KeyboardKey.Backspace, "delete": KeyboardKey.Delete,
    "insert": KeyboardKey.Insert, "caps_lock": KeyboardKey.CapsLock, "scroll_lock": KeyboardKey.ScrollLock,
    "num_lock": KeyboardKey.NumLock, "print_screen": KeyboardKey.PrintScreen, "pause": KeyboardKey.Pause,
    // Add other special keys as needed based on pynput.keyboard.Key and KeyboardKey enum
    "alt_l": KeyboardKey.Alt, "alt_r": KeyboardKey.Alt, "alt_gr": KeyboardKey.Alt, // Map specific alt keys to general Alt
    "cmd_l": KeyboardKey.Meta, "cmd_r": KeyboardKey.Meta, // Map specific cmd keys to general Meta
    "ctrl_l": KeyboardKey.Control, "ctrl_r": KeyboardKey.Control, // Map specific ctrl keys to general Control
    "shift_l": KeyboardKey.Shift, "shift_r": KeyboardKey.Shift // Map specific shift keys to general Shift
}

// Reverse mapping from KeyboardKey enum to string representation for formatting
const keyboardKeyToStringMap: { [key in KeyboardKey]: string } = {
    // Letters
    [KeyboardKey.A]: "a", [KeyboardKey.B]: "b", [KeyboardKey.C]: "c", [KeyboardKey.D]: "d", [KeyboardKey.E]: "e",
    [KeyboardKey.F]: "f", [KeyboardKey.G]: "g", [KeyboardKey.H]: "h", [KeyboardKey.I]: "i", [KeyboardKey.J]: "j",
    [KeyboardKey.K]: "k", [KeyboardKey.L]: "l", [KeyboardKey.M]: "m", [KeyboardKey.N]: "n", [KeyboardKey.O]: "o",
    [KeyboardKey.P]: "p", [KeyboardKey.Q]: "q", [KeyboardKey.R]: "r", [KeyboardKey.S]: "s", [KeyboardKey.T]: "t",
    [KeyboardKey.U]: "u", [KeyboardKey.V]: "v", [KeyboardKey.W]: "w", [KeyboardKey.X]: "x", [KeyboardKey.Y]: "y",
    [KeyboardKey.Z]: "z",

    // Numbers
    [KeyboardKey.Zero]: "0", [KeyboardKey.One]: "1", [KeyboardKey.Two]: "2", [KeyboardKey.Three]: "3", [KeyboardKey.Four]: "4",
    [KeyboardKey.Five]: "5", [KeyboardKey.Six]: "6", [KeyboardKey.Seven]: "7", [KeyboardKey.Eight]: "8", [KeyboardKey.Nine]: "9",

    // Function Keys
    [KeyboardKey.F1]: "<f1>", [KeyboardKey.F2]: "<f2>", [KeyboardKey.F3]: "<f3>", [KeyboardKey.F4]: "<f4>",
    [KeyboardKey.F5]: "<f5>", [KeyboardKey.F6]: "<f6>", [KeyboardKey.F7]: "<f7>", [KeyboardKey.F8]: "<f8>",
    [KeyboardKey.F9]: "<f9>", [KeyboardKey.F10]: "<f10>", [KeyboardKey.F11]: "<f11>", [KeyboardKey.F12]: "<f12>",

    // Modifier Keys
    [KeyboardKey.Shift]: "<shift>", [KeyboardKey.Control]: "<ctrl>", [KeyboardKey.Alt]: "<alt>", [KeyboardKey.Meta]: "<cmd>",

    // Navigation Keys
    [KeyboardKey.ArrowUp]: "<arrowup>", [KeyboardKey.ArrowDown]: "<arrowdown>",
    [KeyboardKey.ArrowLeft]: "<arrowleft>", [KeyboardKey.ArrowRight]: "<arrowright>",
    [KeyboardKey.Home]: "<home>", [KeyboardKey.End]: "<end>", [KeyboardKey.PageUp]: "<pageup>",
    [KeyboardKey.PageDown]: "<pagedown>",

    // Other Common Keys
    [KeyboardKey.Enter]: "<enter>", [KeyboardKey.Escape]: "<esc>", [KeyboardKey.Tab]: "<tab>", [KeyboardKey.Space]: " ",
    [KeyboardKey.Backspace]: "<backspace>", [KeyboardKey.Delete]: "<delete>", [KeyboardKey.Insert]: "<insert>",

    // Punctuation and Symbols (Common)
    [KeyboardKey.Comma]: ",", [KeyboardKey.Period]: ".", [KeyboardKey.Slash]: "/", [KeyboardKey.Backslash]: "\\",
    [KeyboardKey.Semicolon]: ";", [KeyboardKey.Quote]: '"', [KeyboardKey.BracketLeft]: "[", [KeyboardKey.BracketRight]: "]",
    [KeyboardKey.Backquote]: "`", [KeyboardKey.Minus]: "-", [KeyboardKey.Equal]: "=",

    // Numpad Keys (Assuming these map directly to their string representation or need specific handling)
    [KeyboardKey.Numpad0]: "<numpad0>", [KeyboardKey.Numpad1]: "<numpad1>", [KeyboardKey.Numpad2]: "<numpad2>",
    [KeyboardKey.Numpad3]: "<numpad3>", [KeyboardKey.Numpad4]: "<numpad4>", [KeyboardKey.Numpad5]: "<numpad5>",
    [KeyboardKey.Numpad6]: "<numpad6>", [KeyboardKey.Numpad7]: "<numpad7>", [KeyboardKey.Numpad8]: "<numpad8>",
    [KeyboardKey.Numpad9]: "<numpad9>", [KeyboardKey.NumpadMultiply]: "<numpadmultiply>", [KeyboardKey.NumpadAdd]: "<numpadadd>",
    [KeyboardKey.NumpadSubtract]: "<numpadsubtract>", [KeyboardKey.NumpadDecimal]: "<numpaddecimal>", [KeyboardKey.NumpadDivide]: "<numpaddivide>",

    // Lock Keys
    [KeyboardKey.CapsLock]: "<caps_lock>", [KeyboardKey.ScrollLock]: "<scroll_lock>", [KeyboardKey.NumLock]: "<num_lock>",

    // Other
    [KeyboardKey.PrintScreen]: "<print_screen>", [KeyboardKey.Pause]: "<pause>",
    // Add other keys from KeyboardKey enum as needed
}

/**
 * Parses a key combination string.
 *
 * Key combination strings are sequences of key identifiers separated by
 * `'+'`. Key identifiers are either single characters representing a
 * keyboard key, such as `'a'`, or special key names identified by names
 * enclosed by brackets, such as `'<ctrl>'`.
 *
 * Keyboard keys are case-insensitive.
 *
 * @param {string} keys - The key combination string.
 * @returns {Array<KeyboardKey>} An array of parsed KeyboardKey enum values.
 * @throws {Error} if a part of the keys string is invalid, or if it
 * contains multiple equal parts.
 */
function parseKeyCombination(keys: string): KeyboardKey[] {
    /**
     * Generator function to split the key combination string into parts.
     * @param {string} keys - The key combination string.
     * @yields {string} Each part of the key combination.
     * @throws {Error} if the string ends with '+'.
     */
    function* parts(keys: string): Generator<string, void, void> {
        let start = 0
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] === "+" && i !== start) {
                yield keys.substring(start, i)
                start = i + 1
            }
        }
        if (start === keys.length) {
            throw new Error(`Invalid key combination string: ${keys}`)
        } else {
            yield keys.substring(start)
        }
    }

    /**
     * Parses a single key string part and maps it to a KeyboardKey.
     * @param {string} s - The key string part.
     * @returns {KeyboardKey} The parsed KeyboardKey enum value.
     * @throws {Error} if the part is invalid or cannot be mapped.
     */
    function parseKeyStringPart(s: string): KeyboardKey {
        if (s.length === 1) {
            const lowerS = s.toLowerCase()
            if (charToKeyboardKeyMap[lowerS]) {
                return charToKeyboardKeyMap[lowerS]
            } else {
                 // Handle potential uppercase characters not in the lowercase map
                 const upperS = s.toUpperCase()
                 if (charToKeyboardKeyMap[upperS]) {
                     return charToKeyboardKeyMap[upperS]
                 }
            }
             // If still not found, check if it's a single character that maps to a special key (e.g. space)
            if (specialKeyNameToKeyboardKeyMap[lowerS]) {
                 return specialKeyNameToKeyboardKeyMap[lowerS]
            }


            throw new Error(`Invalid single character key identifier: ${s}`)

        } else if (s.length > 2 && s.startsWith("<") && s.endsWith(">")) {
            const p = s.substring(1, s.length - 1)
            const lowerP = p.toLowerCase()
            if (specialKeyNameToKeyboardKeyMap[lowerP]) {
                return specialKeyNameToKeyboardKeyMap[lowerP]
            }

            // If not a known special key name, the original Python code tries parsing as VK.
            throw new Error(`Invalid special key name or unsupported virtual key code: ${s}`)
        } else {
            throw new Error(`Invalid key identifier format: ${s}`)
        }
    }

    const rawParts = Array.from(parts(keys))
    const parsedParts: KeyboardKey[] = rawParts.map(parseKeyStringPart)

    const uniqueParts = new Set(parsedParts)
    if (parsedParts.length !== uniqueParts.size) {
        throw new Error(`Duplicate key parts in combination: ${keys}`)
    } else {
        return parsedParts
    }
}

/**
 * Converts an array of KeyboardKey enum values into a key combination string.
 *
 * @param {KeyboardKey[]} keys - An array of KeyboardKey enum values.
 * @returns {string} The key combination string.
 * @throws {Error} if any KeyboardKey value cannot be mapped to a string representation.
 */
function formatKeyCombination(keys: KeyboardKey[]): string {
    const stringParts: string[] = keys.map(key => {
        const stringRep = keyboardKeyToStringMap[key]
        if (stringRep === undefined) {
            throw new Error(`Unsupported KeyboardKey value for formatting: ${key}`)
        }
        return stringRep
    })

    return stringParts.join("+")
}


export { parseKeyCombination, formatKeyCombination }
