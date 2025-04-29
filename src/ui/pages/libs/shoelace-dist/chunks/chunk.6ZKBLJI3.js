import {
  LocalizeController
} from "./chunk.2SU6QBUU.js";
import {
  ShoelaceElement,
  n
} from "./chunk.OGQ452CI.js";
import {
  __decorateClass
} from "./chunk.W27M6RDR.js";

// src/components/format-number/format-number.component.ts
var SlFormatNumber = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.localize = new LocalizeController(this);
    this.value = 0;
    this.type = "decimal";
    this.noGrouping = false;
    this.currency = "USD";
    this.currencyDisplay = "symbol";
  }
  render() {
    if (isNaN(this.value)) {
      return "";
    }
    return this.localize.number(this.value, {
      style: this.type,
      currency: this.currency,
      currencyDisplay: this.currencyDisplay,
      useGrouping: !this.noGrouping,
      minimumIntegerDigits: this.minimumIntegerDigits,
      minimumFractionDigits: this.minimumFractionDigits,
      maximumFractionDigits: this.maximumFractionDigits,
      minimumSignificantDigits: this.minimumSignificantDigits,
      maximumSignificantDigits: this.maximumSignificantDigits
    });
  }
};
__decorateClass([
  n({ type: Number })
], SlFormatNumber.prototype, "value", 2);
__decorateClass([
  n()
], SlFormatNumber.prototype, "type", 2);
__decorateClass([
  n({ attribute: "no-grouping", type: Boolean })
], SlFormatNumber.prototype, "noGrouping", 2);
__decorateClass([
  n()
], SlFormatNumber.prototype, "currency", 2);
__decorateClass([
  n({ attribute: "currency-display" })
], SlFormatNumber.prototype, "currencyDisplay", 2);
__decorateClass([
  n({ attribute: "minimum-integer-digits", type: Number })
], SlFormatNumber.prototype, "minimumIntegerDigits", 2);
__decorateClass([
  n({ attribute: "minimum-fraction-digits", type: Number })
], SlFormatNumber.prototype, "minimumFractionDigits", 2);
__decorateClass([
  n({ attribute: "maximum-fraction-digits", type: Number })
], SlFormatNumber.prototype, "maximumFractionDigits", 2);
__decorateClass([
  n({ attribute: "minimum-significant-digits", type: Number })
], SlFormatNumber.prototype, "minimumSignificantDigits", 2);
__decorateClass([
  n({ attribute: "maximum-significant-digits", type: Number })
], SlFormatNumber.prototype, "maximumSignificantDigits", 2);

export {
  SlFormatNumber
};
