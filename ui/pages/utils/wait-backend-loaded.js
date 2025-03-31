export default function wait() {
    return new Promise((resolve, _) =>
        window.addEventListener("backendloaded", resolve))
}
