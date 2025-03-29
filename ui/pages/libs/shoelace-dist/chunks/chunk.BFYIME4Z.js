import {
  SlRadioGroup
} from "./chunk.ZMQMRL56.js";

// src/react/radio-group/index.ts
import * as React from "react";
import { createComponent } from "@lit/react";
import "@lit/react";
var tagName = "sl-radio-group";
SlRadioGroup.define("sl-radio-group");
var reactWrapper = createComponent({
  tagName,
  elementClass: SlRadioGroup,
  react: React,
  events: {
    onSlChange: "sl-change",
    onSlInput: "sl-input",
    onSlInvalid: "sl-invalid"
  },
  displayName: "SlRadioGroup"
});
var radio_group_default = reactWrapper;

export {
  radio_group_default
};
