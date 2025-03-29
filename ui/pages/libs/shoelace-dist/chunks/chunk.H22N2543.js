import {
  SlIconButton
} from "./chunk.E7U2HBHY.js";

// src/react/icon-button/index.ts
import * as React from "react";
import { createComponent } from "@lit/react";
import "@lit/react";
var tagName = "sl-icon-button";
SlIconButton.define("sl-icon-button");
var reactWrapper = createComponent({
  tagName,
  elementClass: SlIconButton,
  react: React,
  events: {
    onSlBlur: "sl-blur",
    onSlFocus: "sl-focus"
  },
  displayName: "SlIconButton"
});
var icon_button_default = reactWrapper;

export {
  icon_button_default
};
