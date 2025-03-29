import {
  badge_styles_default
} from "./chunk.QULM2YGT.js";
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

// src/components/badge/badge.component.ts
var SlBadge = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.variant = "primary";
    this.pill = false;
    this.pulse = false;
  }
  render() {
    return x`
      <span
        part="base"
        class=${e({
      badge: true,
      "badge--primary": this.variant === "primary",
      "badge--success": this.variant === "success",
      "badge--neutral": this.variant === "neutral",
      "badge--warning": this.variant === "warning",
      "badge--danger": this.variant === "danger",
      "badge--pill": this.pill,
      "badge--pulse": this.pulse
    })}
        role="status"
      >
        <slot></slot>
      </span>
    `;
  }
};
SlBadge.styles = [component_styles_default, badge_styles_default];
__decorateClass([
  n({ reflect: true })
], SlBadge.prototype, "variant", 2);
__decorateClass([
  n({ type: Boolean, reflect: true })
], SlBadge.prototype, "pill", 2);
__decorateClass([
  n({ type: Boolean, reflect: true })
], SlBadge.prototype, "pulse", 2);

export {
  SlBadge
};
