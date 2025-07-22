import { css, html, LitElement } from "lit"
import { customElement, state } from "lit/decorators.js"
import { I18n } from "../utils/i18n"

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

@customElement("logs-tab")
export class LogsTab extends LitElement {
  static styles = css`
    .frame {
      display: flex;
      flex-direction: column;
      row-gap: .6rem;
      margin: .5rem 1rem;
    }
    .log-file-path {
      display: flex;
      align-items: center;
      gap: .4rem;
    }
    .log-file-path > sl-input {
      flex: 1;
    }
    pre {
      user-select: text;
      font-family: var(--code-font);
    }
  `

  @state()
  logFilePath: string = ""
  @state()
  logContent: string = ""

  async connectedCallback() {
    super.connectedCallback()
    try {
      this.logContent = "Loading log content..."
      this.logFilePath = await globalThis.backend.log_file_path()
      const response = await fetch(`../../InputShare-debug.log`)
      this.logContent = await response.text()
    } catch (error) {
      console.error("Failed to fetch log content:", error)
      this.logContent = `Error loading log content: ${error}`
    }
  }

  render() {
    return html`
      <div class="frame">
        <div class="log-file-path">
          <sl-input .value=${this.logFilePath}></sl-input>
          <sl-copy-button .value=${this.logFilePath}></sl-copy-button>
        </div>
        <pre>${this.logContent}</pre>
      </div>
    `
  }
}
