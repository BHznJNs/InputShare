import {
  SlIcon
} from "./chunk.AGWHFEOF.js";

// src/react/icon/index.ts
import * as React from "react";
import { createComponent } from "@lit/react";
import "@lit/react";
var tagName = "sl-icon";
SlIcon.define("sl-icon");
var reactWrapper = createComponent({
  tagName,
  elementClass: SlIcon,
  react: React,
  events: {
    onSlLoad: "sl-load",
    onSlError: "sl-error"
  },
  displayName: "SlIcon"
});
var icon_default = reactWrapper;

export {
  icon_default
};
