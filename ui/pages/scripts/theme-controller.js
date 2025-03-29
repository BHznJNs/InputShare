const darkModeMediaQuery = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)")
const darkThemeClass = "sl-theme-dark"
const lightThemeClass = "sl-theme-light"
const darkModeSwitcher = () => {
    const isDarkMode = darkModeMediaQuery.matches
    document.documentElement.classList.toggle(darkThemeClass ,  isDarkMode)
    document.documentElement.classList.toggle(lightThemeClass, !isDarkMode)
}
if (darkModeMediaQuery) {
    darkModeMediaQuery.addEventListener("change", darkModeSwitcher)
    darkModeSwitcher()
}
