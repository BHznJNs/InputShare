import {
  SlPopup
} from "./chunk.NDC2Y3JV.js";

// src/react/popup/index.ts
import * as React from "react";
import { createComponent } from "@lit/react";
import "@lit/react";
var tagName = "sl-popup";
SlPopup.define("sl-popup");
var reactWrapper = createComponent({
  tagName,
  elementClass: SlPopup,
  react: React,
  events: {
    onSlReposition: "sl-reposition"
  },
  displayName: "SlPopup"
});
var popup_default = reactWrapper;

export {
  popup_default
};
