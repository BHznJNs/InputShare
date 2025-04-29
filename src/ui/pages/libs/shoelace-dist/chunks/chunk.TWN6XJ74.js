import {
  tag_styles_default
} from "./chunk.6VP72EQR.js";
import {
  SlIconButton
} from "./chunk.E7U2HBHY.js";
import {
  LocalizeController
} from "./chunk.2SU6QBUU.js";
import {
  e
} from "./chunk.3RBSSBZT.js";
import {
  component_styles_default
} from "./chunk.INZSKSLC.js";
import {
  ShoelaceElement,
  n
} from "./chunk.OGQ452CI.js";
import {
  x
} from "./chunk.OOP2EFQH.js";
import {
  __decorateClass
} from "./chunk.W27M6RDR.js";

// src/components/tag/tag.component.ts
var SlTag = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.localize = new LocalizeController(this);
    this.variant = "neutral";
    this.size = "medium";
    this.pill = false;
    this.removable = false;
  }
  handleRemoveClick() {
    this.emit("sl-remove");
  }
  render() {
    return x`
      <span
        part="base"
        class=${e({
      tag: true,
      // Types
      "tag--primary": this.variant === "primary",
      "tag--success": this.variant === "success",
      "tag--neutral": this.variant === "neutral",
      "tag--warning": this.variant === "warning",
      "tag--danger": this.variant === "danger",
      "tag--text": this.variant === "text",
      // Sizes
      "tag--small": this.size === "small",
      "tag--medium": this.size === "medium",
      "tag--large": this.size === "large",
      // Modifiers
      "tag--pill": this.pill,
      "tag--removable": this.removable
    })}
      >
        <slot part="content" class="tag__content"></slot>

        ${this.removable ? x`
              <sl-icon-button
                part="remove-button"
                exportparts="base:remove-button__base"
                name="x-lg"
                library="system"
                label=${this.localize.term("remove")}
                class="tag__remove"
                @click=${this.handleRemoveClick}
                tabindex="-1"
              ></sl-icon-button>
            ` : ""}
      </span>
    `;
  }
};
SlTag.styles = [component_styles_default, tag_styles_default];
SlTag.dependencies = { "sl-icon-button": SlIconButton };
__decorateClass([
  n({ reflect: true })
], SlTag.prototype, "variant", 2);
__decorateClass([
  n({ reflect: true })
], SlTag.prototype, "size", 2);
__decorateClass([
  n({ type: Boolean, reflect: true })
], SlTag.prototype, "pill", 2);
__decorateClass([
  n({ type: Boolean })
], SlTag.prototype, "removable", 2);

export {
  SlTag
};
