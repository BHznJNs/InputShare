import {
  breadcrumb_item_styles_default
} from "./chunk.GUCZNPII.js";
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
  x
} from "./chunk.OOP2EFQH.js";
import {
  __decorateClass
} from "./chunk.W27M6RDR.js";

// src/components/breadcrumb-item/breadcrumb-item.component.ts
var SlBreadcrumbItem = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.hasSlotController = new HasSlotController(this, "prefix", "suffix");
    this.renderType = "button";
    this.rel = "noreferrer noopener";
  }
  setRenderType() {
    const hasDropdown = this.defaultSlot.assignedElements({ flatten: true }).filter((i) => i.tagName.toLowerCase() === "sl-dropdown").length > 0;
    if (this.href) {
      this.renderType = "link";
      return;
    }
    if (hasDropdown) {
      this.renderType = "dropdown";
      return;
    }
    this.renderType = "button";
  }
  hrefChanged() {
    this.setRenderType();
  }
  handleSlotChange() {
    this.setRenderType();
  }
  render() {
    return x`
      <div
        part="base"
        class=${e({
      "breadcrumb-item": true,
      "breadcrumb-item--has-prefix": this.hasSlotController.test("prefix"),
      "breadcrumb-item--has-suffix": this.hasSlotController.test("suffix")
    })}
      >
        <span part="prefix" class="breadcrumb-item__prefix">
          <slot name="prefix"></slot>
        </span>

        ${this.renderType === "link" ? x`
              <a
                part="label"
                class="breadcrumb-item__label breadcrumb-item__label--link"
                href="${this.href}"
                target="${o(this.target ? this.target : void 0)}"
                rel=${o(this.target ? this.rel : void 0)}
              >
                <slot @slotchange=${this.handleSlotChange}></slot>
              </a>
            ` : ""}
        ${this.renderType === "button" ? x`
              <button part="label" type="button" class="breadcrumb-item__label breadcrumb-item__label--button">
                <slot @slotchange=${this.handleSlotChange}></slot>
              </button>
            ` : ""}
        ${this.renderType === "dropdown" ? x`
              <div part="label" class="breadcrumb-item__label breadcrumb-item__label--drop-down">
                <slot @slotchange=${this.handleSlotChange}></slot>
              </div>
            ` : ""}

        <span part="suffix" class="breadcrumb-item__suffix">
          <slot name="suffix"></slot>
        </span>

        <span part="separator" class="breadcrumb-item__separator" aria-hidden="true">
          <slot name="separator"></slot>
        </span>
      </div>
    `;
  }
};
SlBreadcrumbItem.styles = [component_styles_default, breadcrumb_item_styles_default];
__decorateClass([
  e2("slot:not([name])")
], SlBreadcrumbItem.prototype, "defaultSlot", 2);
__decorateClass([
  r()
], SlBreadcrumbItem.prototype, "renderType", 2);
__decorateClass([
  n()
], SlBreadcrumbItem.prototype, "href", 2);
__decorateClass([
  n()
], SlBreadcrumbItem.prototype, "target", 2);
__decorateClass([
  n()
], SlBreadcrumbItem.prototype, "rel", 2);
__decorateClass([
  watch("href", { waitUntilFirstUpdate: true })
], SlBreadcrumbItem.prototype, "hrefChanged", 1);

export {
  SlBreadcrumbItem
};
