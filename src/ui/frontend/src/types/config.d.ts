declare global {
    interface ConfigFile {
        device_ip1: string
        detect_port: boolean
        sync_clipboard: boolean
        share_keyboard_only: boolean
        theme: "system" | "dark" | "light"
        mouse_speed: number
        edge_toggling: boolean
        device_position: string
        trigger_margin: number
        keep_wakeup: boolean
        language: string
    }
}
export {}
