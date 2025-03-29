import {
  SlRating
} from "./chunk.LVTIJWMU.js";

// src/react/rating/index.ts
import * as React from "react";
import { createComponent } from "@lit/react";
import "@lit/react";
var tagName = "sl-rating";
SlRating.define("sl-rating");
var reactWrapper = createComponent({
  tagName,
  elementClass: SlRating,
  react: React,
  events: {
    onSlChange: "sl-change",
    onSlHover: "sl-hover"
  },
  displayName: "SlRating"
});
var rating_default = reactWrapper;

export {
  rating_default
};
