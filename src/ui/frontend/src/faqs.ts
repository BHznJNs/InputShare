import "./index.css"
import { marked } from "marked"
import { LitElement, html, css } from "lit"
import { customElement, state } from "lit/decorators.js"

import "@shoelace-style/shoelace/dist/themes/light.css"
import "@shoelace-style/shoelace/dist/themes/dark.css"
import "@shoelace-style/shoelace/dist/components/button/button.js"
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js"

import "./utils/inject-global-style.ts"
import "./utils/theme-controller.ts"
import { I18n } from "./utils/i18n.ts"
import waitBackendLoad from "./utils/wait-backend-loaded.ts"
import { unsafeHTML } from "lit/directives/unsafe-html.js"

setBasePath("./")
await waitBackendLoad()
const config = (await globalThis.backend.config()) as ConfigFile
const i18n = new I18n(config.language)

marked.use({ renderer: {
  link: ({href, title, text}) => {
    return `<sl-button variant="text"
      size="large" target="_blank"
      href="${href}"
      title="${title}">${text}
    </sl-button>`
  }
}})

@customElement("app-root")
export class AppRoot extends LitElement {
  static styles = css`
    .prose {
      margin-left: 1rem;
      margin-right: 1rem;
      user-select: auto; 
    }
    @media screen and (prefers-color-scheme: dark) {
      .prose {
        color: #f7f7f7;
      }
    }
  `

  @state()
  private faqContent: string = i18n.select("Loading FAQs...") // State to hold the loaded markdown content

  async firstUpdated() {
    const langToFetch = i18n.select("en", "zh", "ja", "fr", "es", "ru", "ar")
    try {
      const response = await fetch(`../../../docs/faqs/faqs_${langToFetch}.md`)

      if (!response.ok) {
        console.warn(`FAQ for language ${langToFetch} not found, trying English fallback.`)
        const fallbackResponse = await fetch("../../../../docs/faqs/faqs_en.md")
        if (!fallbackResponse.ok) {
          throw new Error("FAQ content not found, even English fallback failed.")
        }
        const markdownText = await fallbackResponse.text()
        this.faqContent = await marked.parse(markdownText)
        return
      }

      const markdownText = await response.text()
      this.faqContent = await marked.parse(markdownText)
    } catch (error) {
      console.error("Error loading or parsing FAQ:", error)
      this.faqContent = "Failed to load FAQs."
    }
  }

  render() {
    return html`
      <div class="prose">
        ${unsafeHTML(this.faqContent)}
      </div>
    `
  }
}
