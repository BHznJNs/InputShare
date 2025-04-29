export default function wait() {
    if (globalThis.backendloaded) return
    return new Promise((resolve, _) =>
        window.addEventListener("backendloaded", resolve))
}
