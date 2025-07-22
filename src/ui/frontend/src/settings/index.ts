import "../index.css"
import { css, html, LitElement } from "lit"
import { createRef, ref } from "lit/directives/ref.js"
import { customElement, state } from "lit/decorators.js"

import "@shoelace-style/shoelace"
import "@shoelace-style/shoelace/dist/themes/light.css"
import "@shoelace-style/shoelace/dist/themes/dark.css"
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js"

import "../utils/inject-global-style.ts"
import "../utils/theme-controller.ts"
import { I18n } from "../utils/i18n.ts"
import waitBackendLoad from "../utils/wait-backend-loaded.ts"

import "./general-tab.ts"
import "./edge-toggling-tab.ts"
import "./custom-controls-tab.ts"
import "./logs-tab.ts"
import "./about-tab.ts"
import type { GeneralTab } from "./general-tab.ts"
import type { EdgeTogglingTab } from "./edge-toggling-tab.ts"
import type { CustomControlsTab } from "./custom-controls-tab.ts"

declare global {
  interface Backend {
    config: () => Promise<ConfigFile>
    save_config: (new_config: Partial<ConfigFile>) => Promise<void>
    log_file_path: () => Promise<string>
  }
  var backend: Backend
  var config: ConfigFile // Make config globally available
  var i18n: I18n // Make i18n globally available
}

setBasePath("./")
await waitBackendLoad()
const config = globalThis.config = (await globalThis.backend.config()) as ConfigFile
const i18n = globalThis.i18n = new I18n(config.language)

@customElement("setting-item")
export class SettingItem extends LitElement {
  static styles = css`
    .frame {
      display: grid;
      grid-template-columns: auto 10rem;
      column-gap: 1rem;
      align-items: baseline;
    }
    slot[name="description"] {
      font-size: 12px;
    }
    slot[name="control"]::slotted(*) {
      justify-self: self-end;
      max-width: 10rem;
    }
  `

  render() {
    return html`
      <div class="frame">
        <div>
          <slot name="title"></slot>
          <slot name="description"></slot>
        </div>
        <slot name="control"></slot>
      </div>
    `
  }
}

@customElement("app-root")
export class AppRoot extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    sl-tab-group {
      flex: 1;
      min-height: 0;
      border-bottom: solid var(--track-width) var(--track-color);
    }
    sl-tab-group::part(base),
    sl-tab-group::part(nav),
    sl-tab-group::part(tabs) {
      height: 100%;
    }
    sl-tab-group::part(nav) {
      display: flex;
    }
    sl-tab-panel {
      overflow-x: hidden;
    }

    div.actions {
      display: flex;
      justify-content: flex-end;
      column-gap: 1rem;
      padding: 1rem 2rem;
    }
  `

  @state()
  isSaving = false

  private generalTabRef = createRef<GeneralTab>()
  private edgeTogglingTabRef = createRef<EdgeTogglingTab>()
  private customControlsTabRef = createRef<CustomControlsTab>()

  showTabHandler({detail: { name }}: {detail: {name: string}}) {
    if (name !== "edge-toggling") return
    setTimeout(() => {
      this.edgeTogglingTabRef.value?.activated()
    }, 500)
  }

  async save() {
    this.isSaving = true
    const generalTab = this.generalTabRef.value!
    const edgeTogglingTab = this.edgeTogglingTabRef.value!
    const customControlsTab = this.customControlsTabRef.value!
    const finalConfig = {
      toggle_hotkey: customControlsTab.toggleHotkey,
      exit_hotkey: customControlsTab.exitHotkey,

      theme: generalTab.theme,
      mouse_speed: generalTab.mouseSpeed,
      edge_toggling: edgeTogglingTab.enable,
      device_position: edgeTogglingTab.position,
      trigger_margin: edgeTogglingTab.triggerMargin,
      keep_wakeup: generalTab.keepScreenOn,
      language: generalTab.language,
    } as Partial<ConfigFile>
    await globalThis.backend.save_config(finalConfig)
    window.close()
  }
  cancel() {
    window.close()
  }

  render() {
    return html`
      <sl-tab-group placement="start" @sl-tab-show=${this.showTabHandler}>
        <sl-tab slot="nav" panel="general">${i18n.select("General", "通用")}</sl-tab>
        <sl-tab slot="nav" panel="edge-toggling">${i18n.select("Edge Toggling", "贴边切换")}</sl-tab>
        <sl-tab slot="nav" panel="custom-controls">${i18n.select("Custom Controls", "按键配置")}</sl-tab>
        <sl-tab slot="nav" panel="logs">${i18n.select("Logs", "日志")}</sl-tab>
        <sl-tab slot="nav" panel="about">${i18n.select("About", "关于")}</sl-tab>

        <sl-tab-panel name="general">
          <general-tab ${ref(this.generalTabRef)}></general-tab>
        </sl-tab-panel>
        <sl-tab-panel name="edge-toggling">
          <edge-toggling-tab ${ref(this.edgeTogglingTabRef)}></edge-toggling-tab>
        </sl-tab-panel>
        <sl-tab-panel name="custom-controls">
          <custom-controls-tab ${ref(this.customControlsTabRef)}></custom-controls-tab>
        </sl-tab-panel>
        <sl-tab-panel name="logs">
          <logs-tab></logs-tab>
        </sl-tab-panel>
        <sl-tab-panel name="about">
          <about-tab></about-tab>
        </sl-tab-panel>
      </sl-tab-group>
      <div class="actions">
        <sl-button variant="default"
          @click=${this.cancel}
        >${i18n.select("Cancel", "取消")}</sl-button>
        <sl-tooltip
          content="${i18n.select(
            "Some settings require a restart to take effect.",
            "部分设置需要重启应用后生效。",
          )}"
        >
          <sl-button variant="primary"
            @click=${this.save}
            .loading=${this.isSaving}
          >${i18n.select("Save", "保存")}</sl-button>
        </sl-tooltip>
      </div>
    `
  }
}
