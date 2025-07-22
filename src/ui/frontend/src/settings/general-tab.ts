import { css, html, LitElement } from "lit"
import { createRef, ref, Ref } from "lit/directives/ref.js"
import { customElement } from "lit/decorators.js"
import type { SlCheckbox, SlRange, SlSelect } from "@shoelace-style/shoelace"
import { I18n } from "../utils/i18n.ts"

declare global {
  interface Backend {
    config: () => Promise<ConfigFile>
    save_config: (new_config: Partial<ConfigFile>) => Promise<void>
    log_file_path: () => Promise<string>
  }
  var backend: Backend
  var config: ConfigFile
  var i18n: I18n
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
