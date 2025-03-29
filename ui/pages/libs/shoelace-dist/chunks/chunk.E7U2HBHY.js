import {
  icon_button_styles_default
} from "./chunk.VMDRFYXT.js";
import {
  i,
  u
} from "./chunk.UBADX4L7.js";
import {
  o
} from "./chunk.ZTHCIXLL.js";
import {
  SlIcon
} from "./chunk.AGWHFEOF.js";
import {
  e
} from "./chunk.3RBSSBZT.js";
import {
  component_styles_default
} from "./chunk.INZSKSLC.js";
import {
  ShoelaceElement,
  e as e2,
  n,
  r
} from "./chunk.OGQ452CI.js";
import {
  __decorateClass
} from "./chunk.W27M6RDR.js";

// src/components/icon-button/icon-button.component.ts
var SlIconButton = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.hasFocus = false;
    this.label = "";
    this.disabled = false;
  }
  handleBlur() {
    this.hasFocus = false;
    this.emit("sl-blur");
  }
  handleFocus() {
    this.hasFocus = true;
    this.emit("sl-focus");
  }
  handleClick(event) {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
  /** Simulates a click on the icon button. */
  click() {
    this.button.click();
  }
  /** Sets focus on the icon button. */
  focus(options) {
    this.button.focus(options);
  }
  /** Removes focus from the icon button. */
  blur() {
    this.button.blur();
  }
  render() {
    const isLink = this.href ? true : false;
    const tag = isLink ? i`a` : i`button`;
    return u`
      <${tag}
        part="base"
        class=${e({
      "icon-button": true,
      "icon-button--disabled": !isLink && this.disabled,
      "icon-button--focused": this.hasFocus
    })}
        ?disabled=${o(isLink ? void 0 : this.disabled)}
        type=${o(isLink ? void 0 : "button")}
        href=${o(isLink ? this.href : void 0)}
        target=${o(isLink ? this.target : void 0)}
        download=${o(isLink ? this.download : void 0)}
        rel=${o(isLink && this.target ? "noreferrer noopener" : void 0)}
        role=${o(isLink ? void 0 : "button")}
        aria-disabled=${this.disabled ? "true" : "false"}
        aria-label="${this.label}"
        tabindex=${this.disabled ? "-1" : "0"}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @click=${this.handleClick}
      >
        <sl-icon
          class="icon-button__icon"
          name=${o(this.name)}
          library=${o(this.library)}
          src=${o(this.src)}
          aria-hidden="true"
        ></sl-icon>
      </${tag}>
    `;
  }
};
SlIconButton.styles = [component_styles_default, icon_button_styles_default];
SlIconButton.dependencies = { "sl-icon": SlIcon };
__decorateClass([
  e2(".icon-button")
], SlIconButton.prototype, "button", 2);
__decorateClass([
  r()
], SlIconButton.prototype, "hasFocus", 2);
__decorateClass([
  n()
], SlIconButton.prototype, "name", 2);
__decorateClass([
  n()
], SlIconButton.prototype, "library", 2);
__decorateClass([
  n()
], SlIconButton.prototype, "src", 2);
__decorateClass([
  n()
], SlIconButton.prototype, "href", 2);
__decorateClass([
  n()
], SlIconButton.prototype, "target", 2);
__decorateClass([
  n()
], SlIconButton.prototype, "download", 2);
__decorateClass([
  n()
], SlIconButton.prototype, "label", 2);
__decorateClass([
  n({ type: Boolean, reflect: true })
], SlIconButton.prototype, "disabled", 2);

export {
  SlIconButton
};
