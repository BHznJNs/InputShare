import {
  SlTextarea
} from "./chunk.D4SUTPHP.js";

// src/react/textarea/index.ts
import * as React from "react";
import { createComponent } from "@lit/react";
import "@lit/react";
var tagName = "sl-textarea";
SlTextarea.define("sl-textarea");
var reactWrapper = createComponent({
  tagName,
  elementClass: SlTextarea,
  react: React,
  events: {
    onSlBlur: "sl-blur",
    onSlChange: "sl-change",
    onSlFocus: "sl-focus",
    onSlInput: "sl-input",
    onSlInvalid: "sl-invalid"
  },
  displayName: "SlTextarea"
});
var textarea_default = reactWrapper;

export {
  textarea_default
};
