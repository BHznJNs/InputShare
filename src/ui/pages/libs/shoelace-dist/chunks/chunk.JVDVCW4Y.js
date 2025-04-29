import {
  SlAnimatedImage
} from "./chunk.L6BHDOW4.js";

// src/react/animated-image/index.ts
import * as React from "react";
import { createComponent } from "@lit/react";
import "@lit/react";
var tagName = "sl-animated-image";
SlAnimatedImage.define("sl-animated-image");
var reactWrapper = createComponent({
  tagName,
  elementClass: SlAnimatedImage,
  react: React,
  events: {
    onSlLoad: "sl-load",
    onSlError: "sl-error"
  },
  displayName: "SlAnimatedImage"
});
var animated_image_default = reactWrapper;

export {
  animated_image_default
};
