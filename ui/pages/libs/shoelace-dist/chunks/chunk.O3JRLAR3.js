import {
  SlTreeItem
} from "./chunk.DTID7P2Q.js";

// src/react/tree-item/index.ts
import * as React from "react";
import { createComponent } from "@lit/react";
import "@lit/react";
var tagName = "sl-tree-item";
SlTreeItem.define("sl-tree-item");
var reactWrapper = createComponent({
  tagName,
  elementClass: SlTreeItem,
  react: React,
  events: {
    onSlExpand: "sl-expand",
    onSlAfterExpand: "sl-after-expand",
    onSlCollapse: "sl-collapse",
    onSlAfterCollapse: "sl-after-collapse",
    onSlLazyChange: "sl-lazy-change",
    onSlLazyLoad: "sl-lazy-load"
  },
  displayName: "SlTreeItem"
});
var tree_item_default = reactWrapper;

export {
  tree_item_default
};
