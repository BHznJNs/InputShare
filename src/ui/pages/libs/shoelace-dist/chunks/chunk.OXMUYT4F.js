import {
  radio_button_styles_default
} from "./chunk.T33TOUU7.js";
import {
  u
} from "./chunk.UBADX4L7.js";
import {
  o
} from "./chunk.ZTHCIXLL.js";
import {
  HasSlotController
} from "./chunk.NYIIDP5N.js";
import {
  e
} from "./chunk.3RBSSBZT.js";
import {
  watch
} from "./chunk.JMZM2TDT.js";
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

// src/components/radio-button/radio-button.component.ts
var SlRadioButton = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.hasSlotController = new HasSlotController(this, "[default]", "prefix", "suffix");
    this.hasFocus = false;
    this.checked = false;
    this.disabled = false;
    this.size = "medium";
    this.pill = false;
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("role", "presentation");
  }
  handleBlur() {
    this.hasFocus = false;
    this.emit("sl-blur");
  }
  handleClick(e3) {
    if (this.disabled) {
      e3.preventDefault();
      e3.stopPropagation();
      return;
    }
    this.checked = true;
  }
  handleFocus() {
    this.hasFocus = true;
    this.emit("sl-focus");
  }
  handleDisabledChange() {
    this.setAttribute("aria-disabled", this.disabled ? "true" : "false");
  }
  /** Sets focus on the radio button. */
  focus(options) {
    this.input.focus(options);
  }
  /** Removes focus from the radio button. */
  blur() {
    this.input.blur();
  }
  render() {
    return u`
      <div part="base" role="presentation">
        <button
          part="${`button${this.checked ? " button--checked" : ""}`}"
          role="radio"
          aria-checked="${this.checked}"
          class=${e({
      button: true,
      "button--default": true,
      "button--small": this.size === "small",
      "button--medium": this.size === "medium",
      "button--large": this.size === "large",
      "button--checked": this.checked,
      "button--disabled": this.disabled,
      "button--focused": this.hasFocus,
      "button--outline": true,
      "button--pill": this.pill,
      "button--has-label": this.hasSlotController.test("[default]"),
      "button--has-prefix": this.hasSlotController.test("prefix"),
      "button--has-suffix": this.hasSlotController.test("suffix")
    })}
          aria-disabled=${this.disabled}
          type="button"
          value=${o(this.value)}
          @blur=${this.handleBlur}
          @focus=${this.handleFocus}
          @click=${this.handleClick}
        >
          <slot name="prefix" part="prefix" class="button__prefix"></slot>
          <slot part="label" class="button__label"></slot>
          <slot name="suffix" part="suffix" class="button__suffix"></slot>
        </button>
      </div>
    `;
  }
};
SlRadioButton.styles = [component_styles_default, radio_button_styles_default];
__decorateClass([
  e2(".button")
], SlRadioButton.prototype, "input", 2);
__decorateClass([
  e2(".hidden-input")
], SlRadioButton.prototype, "hiddenInput", 2);
__decorateClass([
  r()
], SlRadioButton.prototype, "hasFocus", 2);
__decorateClass([
  n({ type: Boolean, reflect: true })
], SlRadioButton.prototype, "checked", 2);
__decorateClass([
  n()
], SlRadioButton.prototype, "value", 2);
__decorateClass([
  n({ type: Boolean, reflect: true })
], SlRadioButton.prototype, "disabled", 2);
__decorateClass([
  n({ reflect: true })
], SlRadioButton.prototype, "size", 2);
__decorateClass([
  n({ type: Boolean, reflect: true })
], SlRadioButton.prototype, "pill", 2);
__decorateClass([
  watch("disabled", { waitUntilFirstUpdate: true })
], SlRadioButton.prototype, "handleDisabledChange", 1);

export {
  SlRadioButton
};
