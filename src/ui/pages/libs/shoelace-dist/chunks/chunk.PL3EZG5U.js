import {
  SlCarousel
} from "./chunk.GXABAILW.js";

// src/react/carousel/index.ts
import * as React from "react";
import { createComponent } from "@lit/react";
import "@lit/react";
var tagName = "sl-carousel";
SlCarousel.define("sl-carousel");
var reactWrapper = createComponent({
  tagName,
  elementClass: SlCarousel,
  react: React,
  events: {
    onSlSlideChange: "sl-slide-change"
  },
  displayName: "SlCarousel"
});
var carousel_default = reactWrapper;

export {
  carousel_default
};
