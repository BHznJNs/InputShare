import "./index.css"
import ipaddr from "ipaddr.js"
import { css, html, LitElement } from "lit"
import { ref, createRef, Ref } from "lit/directives/ref.js"
import { customElement, state } from "lit/decorators.js"

import "@shoelace-style/shoelace"
import "@shoelace-style/shoelace/dist/themes/light.css"
import "@shoelace-style/shoelace/dist/themes/dark.css"
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js"
import type { SlInput, SlTooltip, SlTabGroup, SlCheckbox } from "@shoelace-style/shoelace"

import "./utils/inject-global-style.ts"
import "./utils/theme-controller.ts"
import { I18n } from "./utils/i18n.ts"
import waitBackendLoad from "./utils/wait-backend-loaded.ts"


declare global {
  interface Backend {
    set_is_wired_connection: () => Promise<void>
    set_connect_success: () => Promise<void>
    is_first_use: () => Promise<boolean>
    config: () => Promise<ConfigFile>
    try_pairing: (addr: string, pairing_code: string) => Promise<boolean>
    try_connect: (addr: string, detect_port_: boolean) => Promise<boolean>
  }
  var backend: Backend
}

setBasePath("./")
await waitBackendLoad()
const config = (await globalThis.backend.config()) as ConfigFile
const i18n = new I18n(config.language)

@customElement("pairing-tab")
export class PairingTab extends LitElement {
  static styles = css`
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

  @state() allowPair: boolean = false
  @state() isPairing: boolean = false

  private inputs = {
    ip: createRef<SlInput>(),
    port: createRef<SlInput>(),
    pairingCode: createRef<SlInput>(),
  }

  private tooltips = {
    ip: createRef<SlTooltip>(),
    pair: createRef<SlTooltip>(),
  }

  private inputContainer: Ref<HTMLDivElement> = createRef<HTMLDivElement>()

  checkForm(_?: Event): boolean {
    const ip = this.inputs.ip.value?.value
    const port = this.inputs.port.value?.value
    const pairingCode = this.inputs.pairingCode.value?.value
    const hasValidIp = ip && ipaddr.isValid(ip)
    const hasPort = Boolean(port)
    const hasPairingCode = pairingCode && pairingCode.length === 6

    if (ip && !hasValidIp) {
      this.tooltips.ip.value?.show()
    } else {
      this.tooltips.ip.value?.hide()
    }

    this.allowPair = Boolean(hasValidIp && hasPort && hasPairingCode)
    return this.allowPair
  }

  skipPairing(): void {
    this.dispatchEvent(new CustomEvent("skip-pairing"))
  }

  async pair(): Promise<void> {
    this.isPairing = true
    this.tooltips.pair.value?.hide()
    if (!this.checkForm()) {
      this.isPairing = false
      return
    }

    const ip = ipaddr.parse(this.inputs.ip.value!.value).toString()
    const port = this.inputs.port.value!.value
    const pairingCode = this.inputs.pairingCode.value!.value

    const result = await globalThis.backend.try_pairing(`${ip}:${port}`, pairingCode)
    if (result) {
      this.dispatchEvent(new CustomEvent("pairing-succeeded", {
        detail: { ip }
      }))
      return
    }
    this.tooltips.pair.value?.show()
    this.isPairing = false
  }

  render() {
    return html`
      <div class="frame">
        <div class="input-container" ${ref(this.inputContainer)}>
          <div class="ip-port-container">
            <sl-tooltip
              ${ref(this.tooltips.ip)}
              class="manual-tooltip"
              content="${i18n.select("Invalid IP address.", "无效的 IP 地址。")}"
              trigger="manual"
              placement="top-end"
            >
              <sl-input id="ip-input"
                ${ref(this.inputs.ip)}
                @sl-change=${this.checkForm}
                @sl-blur=${this.checkForm}
                @sl-focus=${() => this.tooltips.ip.value?.hide()}
                label="${i18n.select("Pairing IP and port:", "配对 IP 地址和端口：")}"
                filled clearable
              >
                <sl-icon name="globe-asia-australia" slot="prefix"></sl-icon>
              </sl-input>
            </sl-tooltip>
            <span class="divider">:</span>
            <sl-input id="port-input"
              ${ref(this.inputs.port)}
              @sl-input=${this.checkForm}
              placeholder="*****"
              type="number"
              maxlength="5"
              max="65535"
              min="5555"
              filled
            ></sl-input>
          </div>
          <sl-input id="pairingcode-input"
            ${ref(this.inputs.pairingCode)}
            @keydown=${(e: KeyboardEvent) => (e.key === "Enter") && this.pair()}
            @sl-input=${this.checkForm}
            label="${i18n.select("Pairing code:", "配对码：")}"
            placeholder="******"
            maxlength="6"
            filled clearable
          >
            <sl-icon name="123" slot="prefix"></sl-icon>
          </sl-input>
        </div>
        <div class="spacer"></div>
        <div class="actions">
          <sl-button variant="default"
            @click=${this.skipPairing}
          >${i18n.select("Paired? Skip >", "已配对？跳过")}</sl-button>
          <sl-tooltip
            ${ref(this.tooltips.pair)}
            content="${i18n.select("Pairing Failed, please retry.", "配对失败，请重试。")}"
            class="manual-tooltip"
            trigger="manual"
          >
            <sl-button variant="primary"
              .disabled=${!this.allowPair}
              .loading=${this.isPairing}
              @click=${this.pair}
            >${i18n.select("Pair", "配对")}</sl-button>
          </sl-tooltip>
        </div>
      </div>
    `
  }
}

@customElement("connect-tab")
export class ConnectTab extends LitElement {
  static styles = css`
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

  @state() allowConnect: boolean = false
  @state() isConnecting: boolean = false
  @state() autoDetectPort: boolean = config.detect_port

  private inputs = {
    ip: createRef<SlInput>(),
    port: createRef<SlInput>(),
  }

  private tooltips = {
    ip: createRef<SlTooltip>(),
    connect: createRef<SlTooltip>(),
  }

  private autoDetectPortCheckbox: Ref<SlCheckbox> = createRef<SlCheckbox>()

  set deviceIp(newIp: string) {
    if (this.inputs.ip.value) {
      this.inputs.ip.value.value = newIp
    }
  }

  toggleAutoDetectPort(_: Event): void {
    if (this.autoDetectPortCheckbox.value) {
      this.autoDetectPort = this.autoDetectPortCheckbox.value.checked
      this.checkForm()
    }
  }

  checkForm(_?: Event): boolean {
    const ip = this.inputs.ip.value?.value
    const port = this.inputs.port.value?.value
    const hasValidIp = Boolean(ip && ipaddr.isValid(ip))
    const hasPort = Boolean(port)

    if (ip && !hasValidIp) {
      this.tooltips.ip.value?.show()
    } else {
      this.tooltips.ip.value?.hide()
    }

    this.allowConnect = hasValidIp && (this.autoDetectPort || hasPort)
    return this.allowConnect
  }

  skipConnect(): void {
    this.dispatchEvent(new CustomEvent("skip-connect"))
  }

  async connect(): Promise<void> {
    this.isConnecting = true
    this.tooltips.connect.value?.hide()
    if (!this.checkForm()) {
      this.isConnecting = false
      return
    }

    const ip = ipaddr.parse(this.inputs.ip.value!.value).toString()
    const port = this.inputs.port.value?.value
    const addr = this.autoDetectPort ? ip : `${ip}:${port}`
    const result = await globalThis.backend.try_connect(addr, this.autoDetectPort)
    // const result = await webui.call("tryConnect", addr, this.autoDetectPort)

    if (result) {
      this.dispatchEvent(new CustomEvent("connect-succeeded"))
    } else {
      this.tooltips.connect.value?.show()
      setTimeout(() => this.tooltips.connect.value?.hide(), 5000)
    }
    this.isConnecting = false
  }

  // firstUpdated(): void {
  //   this.allowConnect = this.checkForm()
  // }

  render() {
    return html`
      <div class="frame">
        <div class="ip-port-container">
          <sl-tooltip
            ${ref(this.tooltips.ip)}
            class="manual-tooltip"
            content="${i18n.select("Invalid IP address.", "无效的 IP 地址。")}"
            trigger="manual"
            placement="top-end"
          >
            <sl-input id="ip-input"
              ${ref(this.inputs.ip)}
              @sl-change=${this.checkForm}
              value="${config.device_ip1}"
              label="${i18n.select("Wireless debugging IP and port:", "无线调试 IP 地址和端口：")}"
              filled clearable
            >
              <sl-icon name="globe-asia-australia" slot="prefix"></sl-icon>
            </sl-input>
          </sl-tooltip>
          <span class="divider">:</span>
          <sl-input id="port-input"
            ${ref(this.inputs.port)}
            .disabled=${this.autoDetectPort}
            @sl-input=${this.checkForm}
            placeholder="*****"
            type="number"
            maxlength="5"
            max="65535"
            min="5555"
            filled
          ></sl-input>
        </div>
        <sl-checkbox
          ${ref(this.autoDetectPortCheckbox)}
          .checked=${this.autoDetectPort}
          @sl-change=${this.toggleAutoDetectPort}
        >${i18n.select("Auto detect port", "自动检测端口")}</sl-checkbox>
        <div class="spacer"></div>
        <div class="actions">
          <sl-button variant="default"
            @click=${this.skipConnect}
          >${i18n.select("Wired? Skip >", "有线连接？跳过")}</sl-button>
          <sl-tooltip
            ${ref(this.tooltips.connect)}
            content="${i18n.select("Connecting failed, please retry.", "连接失败，请重试。")}"
            class="manual-tooltip"
            trigger="manual"
          >
            <sl-button variant="primary"
              .disabled=${!this.allowConnect}
              .loading=${this.isConnecting}
              @click=${this.connect}
            >${i18n.select("Connect", "连接")}</sl-button>
          </sl-tooltip>
        </div>
      </div>
    `
  }
}

@customElement("app-root")
export class AppRoot extends LitElement {
  static styles = css`
    :host {
      height: 100%;
    }
  `

  private tabGroup: Ref<SlTabGroup> = createRef<SlTabGroup>()
  private connectTab: Ref<ConnectTab> = createRef<ConnectTab>()

  skipPairing(): void {
    this.tabGroup.value?.show("connect")
  }

  pairingSucceeded(event: CustomEvent<{ ip: string }>): void {
    if (this.connectTab.value) {
      this.connectTab.value.deviceIp = event.detail.ip
    }
    this.tabGroup.value?.show("connect")
  }

  async skipConnect(): Promise<void> {
    await globalThis.backend.set_is_wired_connection()
    await globalThis.backend.set_connect_success()
    window.close()
  }

  async connectSucceeded(): Promise<void> {
    await globalThis.backend.set_connect_success()
    window.close()
  }

  async firstUpdated(): Promise<void> {
    if (!await globalThis.backend.is_first_use()) {
      this.tabGroup.value?.show("connect")
    }
  }

  render() {
    return html`
      <sl-tab-group ${ref(this.tabGroup)}>
        <sl-tab slot="nav" panel="pairing">${i18n.select("Pairing", "配对")}</sl-tab>
        <sl-tab slot="nav" panel="connect">${i18n.select("Connect", "连接")}</sl-tab>

        <sl-tab-panel name="pairing">
          <pairing-tab
            @pairing-succeeded=${this.pairingSucceeded}
            @skip-pairing=${this.skipPairing}
          ></pairing-tab>
        </sl-tab-panel>
        <sl-tab-panel name="connect">
          <connect-tab
            ${ref(this.connectTab)}
            @skip-connect=${this.skipConnect}
            @connect-succeeded=${this.connectSucceeded}
          ></connect-tab>
        </sl-tab-panel>
      </sl-tab-group>
    `
  }
}
