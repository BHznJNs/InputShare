import {
  SlTooltip
} from "./chunk.J6I4XZDR.js";

// src/react/tooltip/index.ts
import * as React from "react";
import { createComponent } from "@lit/react";
import "@lit/react";
var tagName = "sl-tooltip";
SlTooltip.define("sl-tooltip");
var reactWrapper = createComponent({
  tagName,
  elementClass: SlTooltip,
  react: React,
  events: {
    onSlShow: "sl-show",
    onSlAfterShow: "sl-after-show",
    onSlHide: "sl-hide",
    onSlAfterHide: "sl-after-hide"
  },
  displayName: "SlTooltip"
});
var tooltip_default = reactWrapper;

export {
  tooltip_default
};
