import {
  carousel_item_styles_default
} from "./chunk.MNXRJNUB.js";
import {
  component_styles_default
} from "./chunk.INZSKSLC.js";
import {
  ShoelaceElement
} from "./chunk.OGQ452CI.js";
import {
  x
} from "./chunk.OOP2EFQH.js";

// src/components/carousel-item/carousel-item.component.ts
var SlCarouselItem = class extends ShoelaceElement {
  connectedCallback() {
    super.connectedCallback();
  }
  render() {
    return x` <slot></slot> `;
  }
};
SlCarouselItem.styles = [component_styles_default, carousel_item_styles_default];

export {
  SlCarouselItem
};
