import {
  SlResizeObserver
} from "./chunk.ILPGQA6P.js";

// src/react/resize-observer/index.ts
import * as React from "react";
import { createComponent } from "@lit/react";
import "@lit/react";
var tagName = "sl-resize-observer";
SlResizeObserver.define("sl-resize-observer");
var reactWrapper = createComponent({
  tagName,
  elementClass: SlResizeObserver,
  react: React,
  events: {
    onSlResize: "sl-resize"
  },
  displayName: "SlResizeObserver"
});
var resize_observer_default = reactWrapper;

export {
  resize_observer_default
};
