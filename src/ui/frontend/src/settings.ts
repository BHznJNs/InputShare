import "./index.css"
import { css, html, LitElement } from "lit"
import { createRef, ref, Ref } from "lit/directives/ref.js"
import { customElement, state } from "lit/decorators.js"

import "@shoelace-style/shoelace"
import "@shoelace-style/shoelace/dist/themes/light.css"
import "@shoelace-style/shoelace/dist/themes/dark.css"
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js"
import type { SlCheckbox, SlInput, SlRange, SlSelect } from "@shoelace-style/shoelace"

import "./utils/inject-global-style.ts"
import "./utils/theme-controller.ts"
import { I18n } from "./utils/i18n.ts"
import waitBackendLoad from "./utils/wait-backend-loaded.ts"

declare global {
  interface Backend {
    config: () => Promise<ConfigFile>
    save_config: (new_config: Partial<ConfigFile>) => Promise<void>
  }
  var backend: Backend
}

setBasePath("./")
await waitBackendLoad()
const config = (await globalThis.backend.config()) as ConfigFile
const i18n = new I18n(config.language)

@customElement("setting-item")
export class SettingItem extends LitElement {
  static styles = css`
    .frame {
      display: grid;
      grid-template-columns: auto 10rem;
      column-gap: 1rem;
      align-items: baseline;
    }
    div.control-container {
      width: 10rem;
    }
    slot[name="description"] {
      font-size: 12px;
    }
    slot[name="control"]::slotted(*) {
      justify-self: self-end;
      max-width: 10rem;
      opacity: .85;
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

@customElement("general-tab")
export class GeneralTab extends LitElement {
  static styles = css`
    .frame {
      display: flex;
      flex-direction: column;
      row-gap: .75rem;
      margin: .5rem 1rem;
    }
    sl-range {
      width: 10rem;
      margin-bottom: .35rem;
    }
  `

  private themeRef: Ref<SlSelect> = createRef()
  private mouseSpeedRef: Ref<SlRange> = createRef()
  private keepScreenOnRef: Ref<SlCheckbox> = createRef()
  private languageRef: Ref<SlSelect> = createRef()

  get theme(): string {
    return this.themeRef.value?.value as string
  }
  get mouseSpeed(): number {
    return this.mouseSpeedRef.value?.value || 0
  }
  get keepScreenOn(): boolean {
    return this.keepScreenOnRef.value?.checked || false
  }
  get language(): string {
    return this.languageRef.value?.value as string
  }

  render() {
    const SYSTEM_THEME = "system"
    const DARK_THEME = "dark"
    const LIGHT_THEME = "light"
    const THEME_NAME_MAP = new Map([
      [SYSTEM_THEME, i18n.select("System", "跟随系统")],
      [DARK_THEME  , i18n.select("Dark theme", "夜间模式")],
      [LIGHT_THEME , i18n.select("Light theme", "日间模式")],
    ])
    const theme = html`
      <setting-item style="z-index: 100">
        <div slot="title">${i18n.select("Theme: ", "界面主题：")}</div>
        <sl-select slot="control"
          value="${config.theme}"
          ${ref(this.themeRef)}
        >
          ${Array.from(THEME_NAME_MAP.keys())
            .map(themeId => html`
              <sl-option value="${themeId}">
                ${THEME_NAME_MAP.get(themeId)}
              </sl-option>
            `)
          }
        </sl-select>
      </setting-item>
    `
    const mouseSpeed = html`
      <setting-item>
        <div slot="title">${i18n.select("Mouse speed: ", "鼠标移动速度：")}</div>
        <sl-range
          ${ref(this.mouseSpeedRef)}
          slot="control"
          tooltip="bottom"
          value="${config.mouse_speed}"
          min="1" max="6" step="0.1"
        ></sl-range>
      </setting-item>
    `
    const keepScreenOn = html`
      <setting-item>
        <div slot="title">${i18n.select("Keep Screen On: ", "保持设备屏幕常亮：")}</div>
        <div slot="description">${i18n.select(
          "When enabled, the Android device screen will stay on and prevent auto-sleep.",
          "启用后，安卓设备屏幕将持续亮屏，防止自动休眠。",
        )}</div>
        <sl-checkbox
          ${ref(this.keepScreenOnRef)}
          slot="control"
          ?checked="${config.keep_wakeup}"
        ></sl-checkbox>
      </setting-item>
    `
    const ENGLISH_LANGUAGE = "en_"
    const CHINESE_LANGUAGE = "zh_"
    const LANGUAGE_NAME_MAP = new Map([
      [ENGLISH_LANGUAGE, "English"],
      [CHINESE_LANGUAGE, "简体中文"],
    ])
    const language = html`
      <setting-item>
        <div slot="title">${i18n.select("Language: ", "语言设置：")}</div>
        <sl-select
          ${ref(this.languageRef)}
          slot="control"
          value="${config.language}"
        >
          ${Array.from(LANGUAGE_NAME_MAP.keys())
            .map(languageId => html`
              <sl-option value="${languageId}">
                ${LANGUAGE_NAME_MAP.get(languageId)}
              </sl-option>
            `)
          }
        </sl-select>
      </setting-item>
    `
    return html`
      <div class="frame">
        ${theme}
        ${mouseSpeed}
        ${keepScreenOn}
        ${language}
      </div>
    `
  }
}

@customElement("edge-toggling-tab")
export class EdgeTogglingTab extends LitElement {
  static styles = css`
    .frame {
      display: flex;
      flex-direction: column;
      row-gap: .6rem;
      margin: .5rem 1rem;
    }

    .enable {
      margin: .3rem 0;
    }
  `

  private enableRef: Ref<SlCheckbox> = createRef()
  private positionRef: Ref<SlSelect> = createRef()
  private triggerMarginRef: Ref<SlInput> = createRef()

  get enable(): boolean {
    return this.enableRef.value?.checked || false
  }
  get position(): string {
    return this.positionRef.value?.value as string
  }
  get triggerMargin(): number {
    return Number.parseInt(this.triggerMarginRef.value?.value || "0")
  }

  render() {
    const TOP    = "top"
    const RIGHT  = "right"
    const BOTTOM = "bottom"
    const LEFT  = "left"
    const POSITION_NAME_MAP = new Map([
      [TOP   , i18n.select("Top side"   , "电脑上方")],
      [RIGHT , i18n.select("Right side" , "电脑右侧")],
      [BOTTOM, i18n.select("Bottom side", "电脑下方")],
      [LEFT  , i18n.select("Left side"  , "电脑左侧")],
    ])

    const enable = html`
      <setting-item class="enable">
        <div slot="title">${i18n.select("Edge Toggling: ", "贴边切换：")}</div>
        <div slot="description">${i18n.select(
          "When enabled, the control will be toggled when the mouse reaches the screen edge.",
          "启用后，当鼠标移至屏幕边缘时会自动切换控制。",
        )}</div>
        <sl-checkbox
          ${ref(this.enableRef)}
          slot="control"
          ?checked=${config.edge_toggling}
        ></sl-checkbox>
      </setting-item>
    `
    const position = html`
      <setting-item style="z-index: 100">
        <div slot="title">${i18n.select("Device Position: ", "设备位置：")}</div>
        <sl-select
          ${ref(this.positionRef)}
          slot="control"
          value="${config.device_position}"
        >
          ${Array.from(POSITION_NAME_MAP.keys())
            .map(positionId => html`
              <sl-option value="${positionId}">
                ${POSITION_NAME_MAP.get(positionId)}
              </sl-option>
            `)
          }
        </sl-select>
      </setting-item>
    `
    const triggerMargin = html`
      <setting-item>
        <div slot="title">${i18n.select("Trigger Margin: ", "触发边距：")}</div>
        <div slot="description">${i18n.select(
          "Prevents triggers when the mouse reaches the corners. Larger values reduce accidents.",
          "避免鼠标触及屏幕角落时触发切换。更大的值可以避免误操作。",
        )}</div>
        <sl-input
          ${ref(this.triggerMarginRef)}
          slot="control"
          value="${config.trigger_margin}"
          type="number"
        ></sl-input>
      </setting-item>
    `
    return html`
      <div class="frame">
        ${enable}
        ${position}
        ${triggerMargin}
      </div>
    `
  }
}

@customElement("about-tab")
export class AboutTab extends LitElement {
  static styles = css`
    .frame {
      display: flex;
      flex-direction: column;
      row-gap: .75rem;
      margin: .5rem 1rem;
    }

    header {
      display: flex;
      align-items: center;
      column-gap: 1rem;
    }
    header img {
      width: 72px;
    }
    header > div {
      display: flex;
      flex-direction: column;
      align-self: center;
    }
    header h1,
    header p {
      margin: 0;
    }
    header p {
      display: flex;
    }
    p sl-button[variant="text"]::part(base) {
      display: flex;
      align-items: center;
      line-height: unset;
      min-height: unset;
      border: none;
    }
    p sl-button[variant="text"]::part(label) {
      padding: 0 .5rem;
    }
  `
  render() {
    return html`
      <div class="frame">
        <header>
          <img src="./../../assets/icon.png">
          <div>
            <h1>InputShare</h1>
            <p>Copyright © 2025 <sl-button variant="text"
              size="large" target="_blank"
              href="https://github.com/BHznJNs">BHznJNs</sl-button>
            </p>
          </div>
        </header>
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

    div.actions {
      display: flex;
      justify-content: flex-end;
      column-gap: 1rem;
      padding: 1rem 2rem;
    }
  `

  @state()
  isSaving = false

  private generalTabRef: Ref<GeneralTab> = createRef()
  private edgeTogglingTabRef: Ref<EdgeTogglingTab> = createRef()

  async save() {
    this.isSaving = true
    const generalTab = this.generalTabRef.value
    const edgeTogglingTab = this.edgeTogglingTabRef.value
    if (generalTab && edgeTogglingTab) {
      const finalConfig = {
        theme: generalTab.theme,
        mouse_speed: generalTab.mouseSpeed,
        edge_toggling: edgeTogglingTab.enable,
        device_position: edgeTogglingTab.position,
        trigger_margin: edgeTogglingTab.triggerMargin,
        keep_wakeup: generalTab.keepScreenOn,
        language: generalTab.language,
      } as Partial<ConfigFile>
      await globalThis.backend.save_config(finalConfig)
    }
    window.close()
  }
  cancel() {
    window.close()
  }

  render() {
    return html`
      <sl-tab-group placement="start">
        <sl-tab slot="nav" panel="general">${i18n.select("General", "通用")}</sl-tab>
        <sl-tab slot="nav" panel="edge-toggling">${i18n.select("Edge Toggling", "贴边切换")}</sl-tab>
        <sl-tab slot="nav" panel="about">${i18n.select("About", "关于")}</sl-tab>

        <sl-tab-panel name="general">
          <general-tab ${ref(this.generalTabRef)}></general-tab>
        </sl-tab-panel>
        <sl-tab-panel name="edge-toggling">
          <edge-toggling-tab ${ref(this.edgeTogglingTabRef)}></edge-toggling-tab>
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
