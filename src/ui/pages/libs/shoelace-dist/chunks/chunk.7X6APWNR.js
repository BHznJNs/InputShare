import {
  SlColorPicker
} from "./chunk.RUT25VT2.js";

// src/react/color-picker/index.ts
import * as React from "react";
import { createComponent } from "@lit/react";
import "@lit/react";
var tagName = "sl-color-picker";
SlColorPicker.define("sl-color-picker");
var reactWrapper = createComponent({
  tagName,
  elementClass: SlColorPicker,
  react: React,
  events: {
    onSlBlur: "sl-blur",
    onSlChange: "sl-change",
    onSlFocus: "sl-focus",
    onSlInput: "sl-input",
    onSlInvalid: "sl-invalid"
  },
  displayName: "SlColorPicker"
});
var color_picker_default = reactWrapper;

export {
  color_picker_default
};
