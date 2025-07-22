import { css, html, LitElement } from "lit"
import { customElement, property, state } from "lit/decorators.js"
import { KeyboardKey, resolveKeyboardEvent } from "../types/keyboard-keys.ts"
import { I18n } from "../utils/i18n.ts"
import { createRef, ref } from "lit/directives/ref.js"
import { SlDialog } from "@shoelace-style/shoelace"
import { formatKeyCombination, parseKeyCombination } from "../utils/parse-keys.ts"

declare global {
  interface Backend {
    config: () => Promise<ConfigFile>
    save_config: (new_config: Partial<ConfigFile>) => Promise<void>
    default_hotkeys: () => Promise<DefaultHotkeys>
    log_file_path: () => Promise<string>
  }
  var backend: Backend
  var config: ConfigFile
  var i18n: I18n
}

@customElement("hotkey-listener")
export class HotkeyListener extends LitElement {
  static styles = css`
    sl-dialog::part(body) {
      outline: none;
    }
    .keys-view {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }
  `

  private dialogRef = createRef<SlDialog>()

  @state()
  private keys: KeyboardKey[] = []
  @property({type: Array})
  initialKeys: KeyboardKey[] = []
  @property({type: Array})
  defaultKeys: KeyboardKey[] | null = null

  // use arrow function to prevent the `this` in these callbacks point to window
  private keydownCallback = (e: KeyboardEvent) => {
    e.preventDefault()
    const key = resolveKeyboardEvent(e)
    if (key === null) return
    const index = this.keys.indexOf(key)
    const isExist = index > -1
    if (isExist) return
    this.keys.push(key)
    this.requestUpdate()
  }

  private start() {
    window.addEventListener("keydown", this.keydownCallback)
  }
  private stop() {
    window.removeEventListener("keydown", this.keydownCallback)
  }

  private cancel() {
    this.hide()
  }
  private restore() {
    if (this.defaultKeys === null) return
    this.dispatchEvent(new CustomEvent("save-hotkey", {
      detail: {
        keys: this.defaultKeys
      }
    }))
    this.hide()
  }
  private save() {
    this.dispatchEvent(new CustomEvent("save-hotkey", {
      detail: {
        keys: this.keys
      }
    }))
    this.hide()
  }

  show() {
    this.keys = []
    this.requestUpdate()
    this.dialogRef.value?.show()
    this.start()
  }
  hide() {
    this.stop()
    this.dialogRef.value?.hide()
  }

  render() {
    return html`
      <sl-dialog ${ref(this.dialogRef)} label=${i18n.select("Enter Hotkey", "输入需要的快捷键")}>
        <div class="keys-view">
          ${
            this.keys.length === 0
            ? this.initialKeys.map(key => html`
                <sl-card>${key}</sl-card>
              `)
            : this.keys.map(key => html`
                <sl-card>${key}</sl-card>
              `)
          }
        </div>
        <sl-button slot="footer" variant="default" @click=${this.cancel}>${i18n.select("Cancel", "取消")}</sl-button>
        <sl-button slot="footer" variant="default" @click=${this.restore}>${i18n.select("Restore", "恢复默认")}</sl-button>
        <sl-button slot="footer" variant="primary" @click=${this.save}>${i18n.select("Save", "保存")}</sl-button>
      </sl-dialog>
    `
  }
}

@customElement("custom-controls-tab")
export class CustomControlsTab extends LitElement {
  static styles = css`
    .frame {
      display: flex;
      flex-direction: column;
      row-gap: .75rem;
      margin: .5rem 1rem;
    }

    .frame span.hotkey {
      font-family: var(--code-font);
    }
    .frame sl-botton.hotkey {
      max-width: unset;
    }
  `

  @state()
  toggleHotkey = config.toggle_hotkey
  @state()
  exitHotkey = config.exit_hotkey
  @state()
  private defaultToggleHotkey: KeyboardKey[] | null = null
  @state()
  private defaultExitHotkey: KeyboardKey[] | null = null

  private toggleHotkeySetter = createRef<HotkeyListener>()
  private exitHotkeySetter = createRef<HotkeyListener>()

  constructor() {
    super()
    globalThis.backend.default_hotkeys().then(({toggle, exit}) => {
      this.defaultToggleHotkey = parseKeyCombination(toggle)
      this.defaultExitHotkey = parseKeyCombination(exit)
    })
  }

  render() {
    return html`
      <hotkey-listener
        ${ref(this.toggleHotkeySetter)}
        @save-hotkey=${({detail: {keys}}: CustomEvent<{keys: KeyboardKey[]}>) =>
                        this.toggleHotkey = formatKeyCombination(keys)}
        .initialKeys=${parseKeyCombination(this.toggleHotkey)}
        .defaultKeys=${this.defaultToggleHotkey}>
      </hotkey-listener>
      <hotkey-listener
        ${ref(this.exitHotkeySetter)}
        @save-hotkey=${({detail: {keys}}: CustomEvent<{keys: KeyboardKey[]}>) =>
                        this.exitHotkey = formatKeyCombination(keys)}
        .initialKeys=${parseKeyCombination(this.exitHotkey)}
        .defaultKeys=${this.defaultExitHotkey}>
      </hotkey-listener>
      <div class="frame">
        <setting-item>
          <div slot="title">${i18n.select("Toggle Controls Hotkey: ", "切换控制快捷键：")}</div>
          <sl-button class="hotkey" slot="control" @click=${() => this.toggleHotkeySetter.value?.show()}>
            <span class="hotkey">${parseKeyCombination(this.toggleHotkey).join(" + ")}</span>
          </sl-button>
        </setting-item>
        <setting-item>
          <div slot="title">${i18n.select("Exit Program Hotkey: ", "退出程序快捷键：")}</div>
          <sl-button class="hotkey" slot="control" @click=${() => this.exitHotkeySetter.value?.show()}>
            <span class="hotkey">${parseKeyCombination(this.exitHotkey).join(" + ")}</span>
          </sl-button>
        </setting-item>
      </div>
    `
  }
}
