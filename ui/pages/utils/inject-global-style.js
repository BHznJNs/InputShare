import { LitElement, css } from "../libs/lit-all.min.js"

const sharedStyles = css`
  :host {
    font-family: var(--text-font);
    user-select: none;
  }
`

const originalCreateRenderRoot = LitElement.prototype.createRenderRoot

LitElement.prototype.createRenderRoot = function() {
  const root = originalCreateRenderRoot.call(this);
  if (root.adoptedStyleSheets !== undefined) {
    const sheet = sharedStyles.styleSheet
    root.adoptedStyleSheets = [sheet, ...root.adoptedStyleSheets]
  } else {
    const style = document.createElement('style')
    style.textContent = globalStyles.cssText
    root.insertBefore(style, root.firstChild)
  }
  return root
}
