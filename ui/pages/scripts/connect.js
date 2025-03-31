import wait from "../utils/wait-backend-loaded.js"
import { css, html, LitElement, ref } from "../libs/lit-all.min.js"

await wait()
const i18n = (await import("../utils/i18n.js")).default
const config = await globalThis.backend.config()

class PairingTab extends LitElement {
  static styles = css`
    :host {
      font-family: var(--text-font);
      user-select: none;
    }
    div.frame {
      margin: 0 2rem;
    }
    div.input-container {
      display: flex;
      flex-direction: column;
      row-gap: 1rem;
    }
    div.ip-port-container {
      display: flex;
      align-items: flex-end;
    }
    div.ip-port-container .divider {
      padding: .6rem;
      font-size: 1.125rem;
      font-weight: bold;
    }
    div.ip-port-container #ip-input {
      flex: 1;
      min-width: 0;
    }
    div.ip-port-container #port-input {
      max-width: 8rem;
    }

    .spacer {
      height: 3rem;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      column-gap: 1rem;
    }
    .ip-port-container sl-tooltip::part(base__popup) {
      margin-top: 1rem;
    }
    .ip-port-container sl-tooltip::part(base__arrow) {
      left: unset !important;
      right: 10px !important;
    }
  `

  static properties = {
    allowPair: {type: Boolean, state: true}
  }

  constructor() {
    super()
    this.inputs = {
      ip: ref(),
      port: ref(),
      pairingCode: ref(),
    }
    this.tooltips = {
      ip: ref(),
      pair: ref(),
    }
    this.inputContainer = ref()
    this.allowPair = false
  }

  checkForm(_) {
    const ip = this.inputs.ip.value.value
    const port = this.inputs.port.value.value
    const pairingCode = this.inputs.pairingCode.value.value
    const hasValidIp = ipaddr.isValid(ip)
    const hasPort = Boolean(port)
    const hasPairingCode = pairingCode && pairingCode.length === 6
    if (ip && !hasValidIp) {
      this.tooltips.ip.value.show()
    }
    this.allowPair = hasValidIp && hasPort && hasPairingCode
    return this.allowPair
  }

  skipPairing() {
    this.dispatchEvent(new CustomEvent("skip-pairing"))
  }

  async pair() {
    this.tooltips.pair.value.hide()
    if (!this.checkForm()) return
    const ip = ipaddr.parse(this.inputs.ip.value.value).toString()
    const port = this.inputs.port.value.value
    const pairingCode = this.inputs.pairingCode.value.value

    const result = await globalThis.backend.try_pairing(`${ip}:${port}`, pairingCode)
    if (result) {
      this.dispatchEvent(new CustomEvent("pairing-succeeded"))
      return
    }
    this.tooltips.pair.value.show()
  }

  firstUpdated() {
    this.inputs.pairingCode.value.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return
      this.pair()
    })
  }

  render() {
    return html`
      <div class="frame">
        <div class="input-container" .ref=${ref(this.inputContainer)}>
          <div class="ip-port-container">
            <sl-tooltip
              .ref=${ref(this.tooltips.ip)}
              class="manual-tooltip"
              content="${i18n("Invalid IP address.", "无效的 IP 地址。")}"
              trigger="manual"
              placement="top-end"
            >
              <sl-input id="ip-input"
                .ref=${ref(this.inputs.ip)}
                @sl-change=${this.checkForm}
                @sl-blur=${this.checkForm}
                @sl-focus=${() => this.tooltips.ip.value.hide()}
                label="${i18n("Pairing IP and port:", "配对 IP 地址和端口：")}"
                filled clearable
              >
                <sl-icon name="globe-asia-australia" slot="prefix"></sl-icon>
              </sl-input>
            </sl-tooltip>
            <span class="divider">:</span>
            <sl-input id="port-input"
              .ref=${ref(this.inputs.port)}
              @sl-input=${this.checkForm}
              placeholder="*****"
              type="number"
              maxlength=5
              max=65535
              min=5555
              filled
            ></sl-input>
          </div>
          <sl-input id="pairingcode-input"
            .ref=${ref(this.inputs.pairingCode)}
            @sl-input=${this.checkForm}
            label="${i18n("Pairing code:", "配对码：")}"
            placeholder="******"
            maxlength=6
            filled clearable
          >
            <sl-icon name="123" slot="prefix"></sl-icon>
          </sl-input>
        </div>
        <div class="spacer"></div>
        <div class="actions">
          <sl-button variant="default"
            @click=${this.skipPairing}
          >${i18n("Paired? Skip >", "已配对？跳过")}</sl-button>
          <sl-tooltip
            .ref=${ref(this.tooltips.pair)}
            content="${i18n("Pairing Failed, please retry.", "配对失败，请重试。")}"
            class="manual-tooltip"
            trigger="manual"
          >
            <sl-button variant="primary"
              .disabled=${!this.allowPair}
              @click=${this.pair}
            >${i18n("Pair", "配对")}</sl-button>
          </sl-tooltip>
        </div>
      </div>
    `
  }
}

class ConnectTab extends LitElement {
  static styles = css`
    :host {
      font-family: var(--text-font);
      user-select: none;
    }
    div.frame {
      margin: 0 2rem;
    }
    div.ip-port-container {
      display: flex;
      align-items: flex-end;
    }
    div.ip-port-container .divider {
      padding: .6rem;
      font-size: 1.125rem;
      font-weight: bold;
    }
    div.ip-port-container #ip-input {
      flex: 1;
      min-width: 0;
    }
    div.ip-port-container #port-input {
      max-width: 8rem;
    }
    sl-checkbox {
      margin-top: 1rem;
    }
    .spacer {
      height: 5.55rem;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      column-gap: 1rem;
    }

    .ip-port-container sl-tooltip::part(base__popup) {
      margin-top: 1rem;
    }
    .ip-port-container sl-tooltip::part(base__arrow) {
      left: unset !important;
      right: 10px !important;
    }
  `

  static properties = {
    allowConnect: {type: Boolean, state: true},
    autoDetectPort: {type: Boolean, state: true},
  }

  constructor() {
    super()
    this.inputs = {
      ip: ref(),
      port: ref(),
    }
    this.tooltips = {
      ip: ref(),
      connect: ref(),
    }
    this.allowConnect = false
    this.autoDetectPort = config.scan_port
    this.autoDetectPortCheckbox = ref()
  }

  toggleAutoDetectPort(_) {
    this.autoDetectPort = this.autoDetectPortCheckbox.value.checked
    this.checkForm()
  }

  checkForm(_) {
    const ip = this.inputs.ip.value.value
    const port = this.inputs.port.value.value
    const hasValidIp = ipaddr.isValid(ip)
    const hasPort = Boolean(port)
    if (ip && !hasValidIp) {
      this.tooltips.ip.value.show()
    }
    this.allowConnect = hasValidIp && (this.autoDetectPort || hasPort)
    return this.allowConnect
  }

  skipConnect() {
    this.dispatchEvent(new CustomEvent("skip-connect"))
  }

  async connect() {
    this.tooltips.connect.value.hide()
    if (!this.checkForm()) return
  
    const ip = ipaddr.parse(this.inputs.ip.value.value).toString()
    const port = this.inputs.port.value.value
    const addr = this.autoDetectPort ? ip : `${ip}:${port}`
    const result = await globalThis.backend.try_connect(addr, this.autoDetectPort)
    if (result) {
      this.dispatchEvent(new CustomEvent("connect-succeeded"))
      return
    }
  }

  render() {
    return html`
      <div class="frame">
        <div class="ip-port-container">
          <sl-tooltip
            .ref=${ref(this.tooltips.ip)}
            class="manual-tooltip"
            content="${i18n("Invalid IP address.", "无效的 IP 地址。")}"
            trigger="manual"
            placement="top-end"
          >
            <sl-input id="ip-input"
              .ref=${ref(this.inputs.ip)}
              @sl-change=${this.checkForm}
              value="${config.device_ip1}"
              label="${i18n("Wireless debugging IP and port:", "无线调试 IP 地址和端口：")}"
              filled clearable
            >
              <sl-icon name="globe-asia-australia" slot="prefix"></sl-icon>
            </sl-input>
          </sl-tooltip>
          <span class="divider">:</span>
          <sl-input id="port-input"
            .ref=${ref(this.inputs.port)}
            .disabled=${this.autoDetectPort}
            @sl-input=${this.checkForm}
            placeholder="*****"
            type="number"
            maxlength=5
            max=65535
            min=5555
            filled
          ></sl-input>
        </div>
        <sl-checkbox
          .ref=${ref(this.autoDetectPortCheckbox)}
          .checked=${this.autoDetectPort}
          @sl-change=${this.toggleAutoDetectPort}
        >${i18n("Auto detect port", "自动检测端口")}</sl-checkbox>
        <div class="spacer"></div>
        <div class="actions">
          <sl-button variant="default"
            @click=${this.skipConnect}
          >${i18n("Wired? Skip >", "有线连接？跳过")}</sl-button>
          <sl-tooltip
            .ref=${ref(this.tooltips.connect)}
            content="${i18n("Connecting failed, please retry.", "连接失败，请重试。")}"
            class="manual-tooltip"
            trigger="manual"
          >
            <sl-button variant="primary"
              .disabled=${!this.allowConnect}
              @click=${this.connect}
            >${i18n("Connect", "连接")}</sl-button>
          </sl-tooltip>
        </div>
      </div>
    `
  }
}

class AppRoot extends LitElement {
  static styles = css`
    :host {
      height: 100%;
    }
  `

  constructor() {
    super()
    this.tabGroup = ref()
  }

  skipPairing() {
    this.tabGroup.value.show("connect")
  }
  pairingSucceeded() {
    this.tabGroup.value.show("connect")
  }

  async skipConnect() {
    await globalThis.backend.set_is_wired_connection()
    window.close()
  }
  connectSucceeded() {
    window.close()
  }

  async firstUpdated() {
    if (!await globalThis.backend.is_first_use()) {
      this.tabGroup.value.show("connect")
    }
  }

  render() {
    return html`
      <sl-tab-group .ref=${ref(this.tabGroup)}>
        <sl-tab slot="nav" panel="pairing">${i18n("Pairing", "配对")}</sl-tab>
        <sl-tab slot="nav" panel="connect">${i18n("Connect", "连接")}</sl-tab>

        <sl-tab-panel name="pairing">
          <pairing-tab
            @pairing-succeeded=${this.pairingSucceeded}
            @skip-pairing=${this.skipPairing}
          ></pairing-tab>
        </sl-tab-panel>
        <sl-tab-panel name="connect">
          <connect-tab
            @skip-connect=${this.skipConnect}
            @connect-succeeded=${this.connectSucceeded}
          ></connect-tab>
        </sl-tab-panel>
      </sl-tab-group>
    `
  }
}

customElements.define("pairing-tab", PairingTab)
customElements.define("connect-tab", ConnectTab)
customElements.define("app-root", AppRoot)
