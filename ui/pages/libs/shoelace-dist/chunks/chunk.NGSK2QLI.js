import {
  SlTabGroup
} from "./chunk.PKRKD3AZ.js";

// src/react/tab-group/index.ts
import * as React from "react";
import { createComponent } from "@lit/react";
import "@lit/react";
var tagName = "sl-tab-group";
SlTabGroup.define("sl-tab-group");
var reactWrapper = createComponent({
  tagName,
  elementClass: SlTabGroup,
  react: React,
  events: {
    onSlTabShow: "sl-tab-show",
    onSlTabHide: "sl-tab-hide"
  },
  displayName: "SlTabGroup"
});
var tab_group_default = reactWrapper;

export {
  tab_group_default
};
