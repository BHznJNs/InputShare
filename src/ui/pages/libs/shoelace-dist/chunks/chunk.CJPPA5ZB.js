import {
  menu_label_styles_default
} from "./chunk.H7MMJU35.js";
import {
  component_styles_default
} from "./chunk.INZSKSLC.js";
import {
  ShoelaceElement
} from "./chunk.OGQ452CI.js";
import {
  x
} from "./chunk.OOP2EFQH.js";

// src/components/menu-label/menu-label.component.ts
var SlMenuLabel = class extends ShoelaceElement {
  render() {
    return x` <slot part="base" class="menu-label"></slot> `;
  }
};
SlMenuLabel.styles = [component_styles_default, menu_label_styles_default];

export {
  SlMenuLabel
};
