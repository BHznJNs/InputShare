import {
  SlCheckbox
} from "./chunk.TD36ASEP.js";

// src/react/checkbox/index.ts
import * as React from "react";
import { createComponent } from "@lit/react";
import "@lit/react";
var tagName = "sl-checkbox";
SlCheckbox.define("sl-checkbox");
var reactWrapper = createComponent({
  tagName,
  elementClass: SlCheckbox,
  react: React,
  events: {
    onSlBlur: "sl-blur",
    onSlChange: "sl-change",
    onSlFocus: "sl-focus",
    onSlInput: "sl-input",
    onSlInvalid: "sl-invalid"
  },
  displayName: "SlCheckbox"
});
var checkbox_default = reactWrapper;

export {
  checkbox_default
};
