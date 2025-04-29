const darkModeMediaQuery = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)")
const darkThemeClass = "sl-theme-dark"
const lightThemeClass = "sl-theme-light"
const darkModeSwitcher = (themeSetting) => {
    const isDarkMode = darkModeMediaQuery.matches
    switch (themeSetting) {
    case "system":
        document.documentElement.classList.toggle(darkThemeClass ,  isDarkMode)
        document.documentElement.classList.toggle(lightThemeClass, !isDarkMode)
        break
    case "light":
        document.documentElement.classList.toggle(darkThemeClass ,  false)
        document.documentElement.classList.toggle(lightThemeClass,  true)
        break
    case "dark":
        document.documentElement.classList.toggle(darkThemeClass ,  true)
        document.documentElement.classList.toggle(lightThemeClass,  false)
        break
    default: throw new Error(`Unexpected theme name: ${themeSetting}`)
    }
}
window.addEventListener("backendloaded", async () => {
    const themeSetting = (await globalThis.backend.config()).theme
    if (darkModeMediaQuery) {
        darkModeMediaQuery.addEventListener("change", () => darkModeSwitcher(themeSetting))
        darkModeSwitcher(themeSetting)
    }
})
