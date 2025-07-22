import { css, html, LitElement } from "lit"
import { customElement, property } from "lit/decorators.js"
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

@customElement("about-link-item")
export class AboutLinkItem extends LitElement {
  static styles = css`
    .frame {
      display: grid;
      align-items: center;
      grid-template-columns: 1fr 3fr;
    }
    .frame sl-button[variant="text"]::part(base) {
      display: flex;
      align-items: center;
      line-height: unset;
      min-height: unset;
      border: none;
    }
    .frame sl-button[variant="text"]::part(label) {
      padding: 0 .5rem;
    }
    .link-content {
      display: flex;
      align-items: center;
    }
  `

  @property({ type: String })
  label!: string

  @property({ type: String })
  iconName: string | undefined

  @property({ type: String })
  linkText!: string

  @property({ type: String })
  linkHref!: string

  render() {
    return html`
      <div class="frame">
        <span>${this.label}</span>
        <span class="link-content">
          ${this.iconName ? html`<sl-icon name="${this.iconName}"></sl-icon>` : ""}
          <sl-button variant="text" size="large" target="_blank" href="${this.linkHref}">
            ${this.linkText}
          </sl-button>
        </span>
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
    p.about-item {
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
        <about-link-item
          label=${i18n.select("Homepage: ", "项目主页：")}
          iconName="github"
          linkText="GitHub"
          href="https://github.com/InputShare/InputShare/"
        ></about-link-item>
        <about-link-item
          label=${i18n.select("Feedback: ", "问题反馈：")}
          iconName="flag"
          linkText="GitHub Issues"
          linkHref="https://github.com/InputShare/InputShare/issues"
        ></about-link-item>
        <about-link-item
          label=${i18n.select("Contact us: ", "联系我们：")}
          iconName="envelope"
          linkText="bhznjns@outlook.com"
          linkHref="mailto:bhznjns@outlook.com"
        ></about-link-item>
        <about-link-item
          label=${i18n.select("License: ", "许可证：")}
          iconName="patch-check"
          linkText="Apache License 2.0"
          linkHref="https://github.com/InputShare/InputShare/blob/master/LICENSE"
        ></about-link-item>
      </div>
    `
  }
}
