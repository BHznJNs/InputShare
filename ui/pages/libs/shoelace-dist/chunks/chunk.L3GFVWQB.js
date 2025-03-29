import {
  SlDrawer
} from "./chunk.Q7W5QCVI.js";

// src/react/drawer/index.ts
import * as React from "react";
import { createComponent } from "@lit/react";
import "@lit/react";
var tagName = "sl-drawer";
SlDrawer.define("sl-drawer");
var reactWrapper = createComponent({
  tagName,
  elementClass: SlDrawer,
  react: React,
  events: {
    onSlShow: "sl-show",
    onSlAfterShow: "sl-after-show",
    onSlHide: "sl-hide",
    onSlAfterHide: "sl-after-hide",
    onSlInitialFocus: "sl-initial-focus",
    onSlRequestClose: "sl-request-close"
  },
  displayName: "SlDrawer"
});
var drawer_default = reactWrapper;

export {
  drawer_default
};
