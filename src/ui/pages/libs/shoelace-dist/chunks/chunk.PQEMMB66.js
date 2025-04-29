import {
  SlCopyButton
} from "./chunk.UFYCLV54.js";

// src/react/copy-button/index.ts
import * as React from "react";
import { createComponent } from "@lit/react";
import "@lit/react";
var tagName = "sl-copy-button";
SlCopyButton.define("sl-copy-button");
var reactWrapper = createComponent({
  tagName,
  elementClass: SlCopyButton,
  react: React,
  events: {
    onSlCopy: "sl-copy",
    onSlError: "sl-error"
  },
  displayName: "SlCopyButton"
});
var copy_button_default = reactWrapper;

export {
  copy_button_default
};
