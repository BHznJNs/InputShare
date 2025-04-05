import "../utils/inject-global-style.js"
import wait from "../utils/wait-backend-loaded.js"
import { css, html, LitElement, ref } from "../libs/lit-all.min.js"

await wait()
const i18n = (await import("../utils/i18n.js")).default
const config = await globalThis.backend.config()

const SYSTEM_THEME = "system"
const DARK_THEME = "dark"
const LIGHT_THEME = "light"
const THEME_NAME_MAP = new Map([
  [SYSTEM_THEME, i18n("System", "跟随系统")],
  [DARK_THEME  , i18n("Dark theme", "夜间模式")],
  [LIGHT_THEME , i18n("Light theme", "日间模式")],
])

const ENGLISH_LANGUAGE = "en_"
const CHINESE_LANGUAGE = "zh_"
const LANGUAGE_NAME_MAP = new Map([
  [ENGLISH_LANGUAGE, "English"],
  [CHINESE_LANGUAGE, "简体中文"],
])

const TOP    = "top"
const RIGHT  = "right"
const BOTTOM = "bottom"
const LEFT   = "left"
const POSITION_NAME_MAP = new Map([
  [TOP   , i18n("Top side"   , "电脑上方")],
  [RIGHT , i18n("Right side" , "电脑右侧")],
  [BOTTOM, i18n("Bottom side", "电脑下方")],
  [LEFT  , i18n("Left side"  , "电脑左侧")],
])

class SettingItem extends LitElement {
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

class GeneralTab extends LitElement {
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

  constructor() {
    super()
    this.refs = {
      theme: ref(),
      mouseSpeed: ref(),
      keepScreenOn: ref(),
      language: ref(),
    }
  }

  get theme() {
    return this.refs.theme.value.value
  }
  get mouseSpeed() {
    return this.refs.mouseSpeed.value.value
  }
  get keepScreenOn() {
    return this.refs.keepScreenOn.value.checked
  }
  get language() {
    return this.refs.language.value.value
  }

  render() {
    const theme = html`
      <setting-item style="z-index: 100">
        <div slot="title">${i18n("Theme: ", "界面主题：")}</div>
        <sl-select slot="control"
          value="${config.theme}"
          .ref=${ref(this.refs.theme)}
        >
          ${THEME_NAME_MAP.keys()
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
        <div slot="title">${i18n("Mouse speed: ", "鼠标移动速度：")}</div>
        <sl-range slot="control"
          .ref=${ref(this.refs.mouseSpeed)}
          value="${config.mouse_speed}"
          min="1" max="6" step="0.1"
        ></sl-range>
      </setting-item>
    `
    const keepScreenOn = html`
      <setting-item>
        <div slot="title">${i18n("Keep Screen On: ", "保持设备屏幕常亮：")}</div>
        <div slot="description">${i18n(
          "When enabled, the Android device screen will stay on and prevent auto-sleep.",
          "启用后，安卓设备屏幕将持续亮屏，防止自动休眠。",
        )}</div>
        <sl-checkbox slot="control"
          checked="${config.keep_wakeup}"
          .ref=${ref(this.refs.keepScreenOn)}
        ></sl-checkbox>
      </setting-item>
    `
    const language = html`
      <setting-item>
        <div slot="title">${i18n("Language: ", "语言设置：")}</div>
        <sl-select slot="control"
          value="${config.language}"
          .ref=${ref(this.refs.language)}
        >
          ${LANGUAGE_NAME_MAP.keys()
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

class EdgeTogglingTab extends LitElement {
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

  constructor() {
    super()
    this.refs = {
      enable: ref(),
      position: ref(),
      triggerMargin: ref(),
    }
  }

  get enable() {
    return this.refs.enable.value.checked
  }
  get position() {
    return this.refs.position.value.value
  }
  get triggerMargin() {
    return Number.parseInt(this.refs.triggerMargin.value.value)
  }

  render() {
    const enable = html`
      <setting-item class="enable">
        <div slot="title">${i18n("Edge Toggling: ", "贴边切换：")}</div>
        <div slot="description">${i18n(
          "When enabled, the control will be toggled when the mouse reaches the screen edge.",
          "启用后，当鼠标移至屏幕边缘时会自动切换控制。",
        )}</div>
        <sl-checkbox slot="control"
          .checked=${config.edge_toggling}
          .ref=${ref(this.refs.enable)}
        ></sl-checkbox>
      </setting-item>
    `
    const position = html`
      <setting-item style="z-index: 100">
        <div slot="title">${i18n("Device Position: ", "设备位置：")}</div>
        <sl-select slot="control"
          value="${config.device_position}"
          .ref=${ref(this.refs.position)}
        >
          ${POSITION_NAME_MAP.keys()
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
        <div slot="title">${i18n("Trigger Margin: ", "触发边距：")}</div>
        <div slot="description">${i18n(
          "Prevents triggers when the mouse reaches the corners. Larger values reduce accidents.",
          "避免鼠标触及屏幕角落时触发切换。更大的值可以避免误操作。",
        )}</div>
        <sl-input slot="control"
          value="${config.trigger_margin}"
          type="number"
          .ref=${ref(this.refs.triggerMargin)}
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

class AboutTab extends LitElement {
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
          <img src="../../assets/icon.png">
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

class AppRoot extends LitElement {
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

  static properties = {
    isSaving: {type: Boolean, state: true},
  }

  constructor() {
    super()
    this.tabs = {
      general: ref(),
      edgeToggling: ref(),
    }
    this.isSaving = false
  }

  async save() {
    this.isSaving = true
    const generalTab = this.tabs.general.value
    const edgeTogglingTab = this.tabs.edgeToggling.value
    await globalThis.backend.save_config({
      theme: generalTab.theme,
      mouse_speed: generalTab.mouseSpeed,
      edge_toggling: edgeTogglingTab.enable,
      device_position: edgeTogglingTab.position,
      trigger_margin: edgeTogglingTab.triggerMargin,
      keep_wakeup: generalTab.keepScreenOn,
      language: generalTab.language,
    })
    window.close()
  }
  cancel() {
    window.close()
  }

  render() {
    return html`
      <sl-tab-group placement="start">
        <sl-tab slot="nav" panel="general">${i18n("General", "通用")}</sl-tab>
        <sl-tab slot="nav" panel="edge-toggling">${i18n("Edge Toggling", "贴边切换")}</sl-tab>
        <sl-tab slot="nav" panel="about">${i18n("About", "关于")}</sl-tab>

        <sl-tab-panel name="general">
          <general-tab .ref=${ref(this.tabs.general)}></general-tab>
        </sl-tab-panel>
        <sl-tab-panel name="edge-toggling">
          <edge-toggling-tab .ref=${ref(this.tabs.edgeToggling)}></edge-toggling-tab>
        </sl-tab-panel>
        <sl-tab-panel name="about">
          <about-tab></about-tab>
        </sl-tab-panel>
      </sl-tab-group>
      <div class="actions">
        <sl-button variant="default"
          @click=${this.cancel}
        >${i18n("Cancel", "取消")}</sl-button>
        <sl-tooltip
          content="${i18n(
            "Some settings require a restart to take effect.",
            "部分设置需要重启应用后生效。",
          )}"
        >
          <sl-button variant="primary"
            @click=${this.save}
            .loading=${this.isSaving}
          >${i18n("Save", "保存")}</sl-button>
        </sl-tooltip>
      </div>
    `
  }
}

customElements.define("setting-item", SettingItem)
customElements.define("general-tab", GeneralTab)
customElements.define("edge-toggling-tab", EdgeTogglingTab)
customElements.define("about-tab", AboutTab)
customElements.define("app-root", AppRoot)
