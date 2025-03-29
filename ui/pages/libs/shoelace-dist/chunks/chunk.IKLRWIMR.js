import {
  SlInput
} from "./chunk.7R3XBKDP.js";

// src/react/input/index.ts
import * as React from "react";
import { createComponent } from "@lit/react";
import "@lit/react";
var tagName = "sl-input";
SlInput.define("sl-input");
var reactWrapper = createComponent({
  tagName,
  elementClass: SlInput,
  react: React,
  events: {
    onSlBlur: "sl-blur",
    onSlChange: "sl-change",
    onSlClear: "sl-clear",
    onSlFocus: "sl-focus",
    onSlInput: "sl-input",
    onSlInvalid: "sl-invalid"
  },
  displayName: "SlInput"
});
var input_default = reactWrapper;

export {
  input_default
};
