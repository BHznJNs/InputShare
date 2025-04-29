import {
  SlDropdown
} from "./chunk.UT2QDHFA.js";

// src/react/dropdown/index.ts
import * as React from "react";
import { createComponent } from "@lit/react";
import "@lit/react";
var tagName = "sl-dropdown";
SlDropdown.define("sl-dropdown");
var reactWrapper = createComponent({
  tagName,
  elementClass: SlDropdown,
  react: React,
  events: {
    onSlShow: "sl-show",
    onSlAfterShow: "sl-after-show",
    onSlHide: "sl-hide",
    onSlAfterHide: "sl-after-hide"
  },
  displayName: "SlDropdown"
});
var dropdown_default = reactWrapper;

export {
  dropdown_default
};
