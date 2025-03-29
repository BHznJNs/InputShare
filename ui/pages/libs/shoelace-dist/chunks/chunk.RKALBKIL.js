import {
  LocalizeController
} from "./chunk.2SU6QBUU.js";
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

// src/components/format-date/format-date.component.ts
var SlFormatDate = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.localize = new LocalizeController(this);
    this.date = /* @__PURE__ */ new Date();
    this.hourFormat = "auto";
  }
  render() {
    const date = new Date(this.date);
    const hour12 = this.hourFormat === "auto" ? void 0 : this.hourFormat === "12";
    if (isNaN(date.getMilliseconds())) {
      return void 0;
    }
    return x`
      <time datetime=${date.toISOString()}>
        ${this.localize.date(date, {
      weekday: this.weekday,
      era: this.era,
      year: this.year,
      month: this.month,
      day: this.day,
      hour: this.hour,
      minute: this.minute,
      second: this.second,
      timeZoneName: this.timeZoneName,
      timeZone: this.timeZone,
      hour12
    })}
      </time>
    `;
  }
};
__decorateClass([
  n()
], SlFormatDate.prototype, "date", 2);
__decorateClass([
  n()
], SlFormatDate.prototype, "weekday", 2);
__decorateClass([
  n()
], SlFormatDate.prototype, "era", 2);
__decorateClass([
  n()
], SlFormatDate.prototype, "year", 2);
__decorateClass([
  n()
], SlFormatDate.prototype, "month", 2);
__decorateClass([
  n()
], SlFormatDate.prototype, "day", 2);
__decorateClass([
  n()
], SlFormatDate.prototype, "hour", 2);
__decorateClass([
  n()
], SlFormatDate.prototype, "minute", 2);
__decorateClass([
  n()
], SlFormatDate.prototype, "second", 2);
__decorateClass([
  n({ attribute: "time-zone-name" })
], SlFormatDate.prototype, "timeZoneName", 2);
__decorateClass([
  n({ attribute: "time-zone" })
], SlFormatDate.prototype, "timeZone", 2);
__decorateClass([
  n({ attribute: "hour-format" })
], SlFormatDate.prototype, "hourFormat", 2);

export {
  SlFormatDate
};
