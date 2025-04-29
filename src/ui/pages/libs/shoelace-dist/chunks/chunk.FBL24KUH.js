import {
  SlRadio
} from "./chunk.657FRMIK.js";

// src/react/radio/index.ts
import * as React from "react";
import { createComponent } from "@lit/react";
import "@lit/react";
var tagName = "sl-radio";
SlRadio.define("sl-radio");
var reactWrapper = createComponent({
  tagName,
  elementClass: SlRadio,
  react: React,
  events: {
    onSlBlur: "sl-blur",
    onSlFocus: "sl-focus"
  },
  displayName: "SlRadio"
});
var radio_default = reactWrapper;

export {
  radio_default
};
