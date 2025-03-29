import {
  SlAnimation
} from "./chunk.XCDC6BMM.js";

// src/react/animation/index.ts
import * as React from "react";
import { createComponent } from "@lit/react";
import "@lit/react";
var tagName = "sl-animation";
SlAnimation.define("sl-animation");
var reactWrapper = createComponent({
  tagName,
  elementClass: SlAnimation,
  react: React,
  events: {
    onSlCancel: "sl-cancel",
    onSlFinish: "sl-finish",
    onSlStart: "sl-start"
  },
  displayName: "SlAnimation"
});
var animation_default = reactWrapper;

export {
  animation_default
};
