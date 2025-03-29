import {
  SlTreeItem
} from "./chunk.DTID7P2Q.js";
import {
  tree_styles_default
} from "./chunk.QAQDTVQK.js";
import {
  clamp
} from "./chunk.HF7GESMZ.js";
import {
  LocalizeController
} from "./chunk.2SU6QBUU.js";
import {
  watch
} from "./chunk.JMZM2TDT.js";
import {
  component_styles_default
} from "./chunk.INZSKSLC.js";
import {
  ShoelaceElement,
  e,
  n
} from "./chunk.OGQ452CI.js";
import {
  x
} from "./chunk.OOP2EFQH.js";
import {
  __decorateClass
} from "./chunk.W27M6RDR.js";

// src/components/tree/tree.component.ts
function syncCheckboxes(changedTreeItem, initialSync = false) {
  function syncParentItem(treeItem) {
    const children = treeItem.getChildrenItems({ includeDisabled: false });
    if (children.length) {
      const allChecked = children.every((item) => item.selected);
      const allUnchecked = children.every((item) => !item.selected && !item.indeterminate);
      treeItem.selected = allChecked;
      treeItem.indeterminate = !allChecked && !allUnchecked;
    }
  }
  function syncAncestors(treeItem) {
    const parentItem = treeItem.parentElement;
    if (SlTreeItem.isTreeItem(parentItem)) {
      syncParentItem(parentItem);
      syncAncestors(parentItem);
    }
  }
  function syncDescendants(treeItem) {
    for (const childItem of treeItem.getChildrenItems()) {
      childItem.selected = initialSync ? treeItem.selected || childItem.selected : !childItem.disabled && treeItem.selected;
      syncDescendants(childItem);
    }
    if (initialSync) {
      syncParentItem(treeItem);
    }
  }
  syncDescendants(changedTreeItem);
  syncAncestors(changedTreeItem);
}
var SlTree = class extends ShoelaceElement {
  constructor() {
    super();
    this.selection = "single";
    this.clickTarget = null;
    this.localize = new LocalizeController(this);
    // Initializes new items by setting the `selectable` property and the expanded/collapsed icons if any
    this.initTreeItem = (item) => {
      item.selectable = this.selection === "multiple";
      ["expand", "collapse"].filter((status) => !!this.querySelector(`[slot="${status}-icon"]`)).forEach((status) => {
        const existingIcon = item.querySelector(`[slot="${status}-icon"]`);
        const expandButtonIcon = this.getExpandButtonIcon(status);
        if (!expandButtonIcon) return;
        if (existingIcon === null) {
          item.append(expandButtonIcon);
        } else if (existingIcon.hasAttribute("data-default")) {
          existingIcon.replaceWith(expandButtonIcon);
        } else {
        }
      });
    };
    this.handleTreeChanged = (mutations) => {
      for (const mutation of mutations) {
        const addedNodes = [...mutation.addedNodes].filter(SlTreeItem.isTreeItem);
        const removedNodes = [...mutation.removedNodes].filter(SlTreeItem.isTreeItem);
        addedNodes.forEach(this.initTreeItem);
        if (this.lastFocusedItem && removedNodes.includes(this.lastFocusedItem)) {
          this.lastFocusedItem = null;
        }
      }
    };
    this.handleFocusOut = (event) => {
      const relatedTarget = event.relatedTarget;
      if (!relatedTarget || !this.contains(relatedTarget)) {
        this.tabIndex = 0;
      }
    };
    this.handleFocusIn = (event) => {
      const target = event.target;
      if (event.target === this) {
        this.focusItem(this.lastFocusedItem || this.getAllTreeItems()[0]);
      }
      if (SlTreeItem.isTreeItem(target) && !target.disabled) {
        if (this.lastFocusedItem) {
          this.lastFocusedItem.tabIndex = -1;
        }
        this.lastFocusedItem = target;
        this.tabIndex = -1;
        target.tabIndex = 0;
      }
    };
    this.addEventListener("focusin", this.handleFocusIn);
    this.addEventListener("focusout", this.handleFocusOut);
    this.addEventListener("sl-lazy-change", this.handleSlotChange);
  }
  async connectedCallback() {
    super.connectedCallback();
    this.setAttribute("role", "tree");
    this.setAttribute("tabindex", "0");
    await this.updateComplete;
    this.mutationObserver = new MutationObserver(this.handleTreeChanged);
    this.mutationObserver.observe(this, { childList: true, subtree: true });
  }
  disconnectedCallback() {
    var _a;
    super.disconnectedCallback();
    (_a = this.mutationObserver) == null ? void 0 : _a.disconnect();
  }
  // Generates a clone of the expand icon element to use for each tree item
  getExpandButtonIcon(status) {
    const slot = status === "expand" ? this.expandedIconSlot : this.collapsedIconSlot;
    const icon = slot.assignedElements({ flatten: true })[0];
    if (icon) {
      const clone = icon.cloneNode(true);
      [clone, ...clone.querySelectorAll("[id]")].forEach((el) => el.removeAttribute("id"));
      clone.setAttribute("data-default", "");
      clone.slot = `${status}-icon`;
      return clone;
    }
    return null;
  }
  selectItem(selectedItem) {
    const previousSelection = [...this.selectedItems];
    if (this.selection === "multiple") {
      selectedItem.selected = !selectedItem.selected;
      if (selectedItem.lazy) {
        selectedItem.expanded = true;
      }
      syncCheckboxes(selectedItem);
    } else if (this.selection === "single" || selectedItem.isLeaf) {
      const items = this.getAllTreeItems();
      for (const item of items) {
        item.selected = item === selectedItem;
      }
    } else if (this.selection === "leaf") {
      selectedItem.expanded = !selectedItem.expanded;
    }
    const nextSelection = this.selectedItems;
    if (previousSelection.length !== nextSelection.length || nextSelection.some((item) => !previousSelection.includes(item))) {
      Promise.all(nextSelection.map((el) => el.updateComplete)).then(() => {
        this.emit("sl-selection-change", { detail: { selection: nextSelection } });
      });
    }
  }
  getAllTreeItems() {
    return [...this.querySelectorAll("sl-tree-item")];
  }
  focusItem(item) {
    item == null ? void 0 : item.focus();
  }
  handleKeyDown(event) {
    if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End", "Enter", " "].includes(event.key)) {
      return;
    }
    if (event.composedPath().some((el) => {
      var _a;
      return ["input", "textarea"].includes((_a = el == null ? void 0 : el.tagName) == null ? void 0 : _a.toLowerCase());
    })) {
      return;
    }
    const items = this.getFocusableItems();
    const isLtr = this.localize.dir() === "ltr";
    const isRtl = this.localize.dir() === "rtl";
    if (items.length > 0) {
      event.preventDefault();
      const activeItemIndex = items.findIndex((item) => item.matches(":focus"));
      const activeItem = items[activeItemIndex];
      const focusItemAt = (index) => {
        const item = items[clamp(index, 0, items.length - 1)];
        this.focusItem(item);
      };
      const toggleExpand = (expanded) => {
        activeItem.expanded = expanded;
      };
      if (event.key === "ArrowDown") {
        focusItemAt(activeItemIndex + 1);
      } else if (event.key === "ArrowUp") {
        focusItemAt(activeItemIndex - 1);
      } else if (isLtr && event.key === "ArrowRight" || isRtl && event.key === "ArrowLeft") {
        if (!activeItem || activeItem.disabled || activeItem.expanded || activeItem.isLeaf && !activeItem.lazy) {
          focusItemAt(activeItemIndex + 1);
        } else {
          toggleExpand(true);
        }
      } else if (isLtr && event.key === "ArrowLeft" || isRtl && event.key === "ArrowRight") {
        if (!activeItem || activeItem.disabled || activeItem.isLeaf || !activeItem.expanded) {
          focusItemAt(activeItemIndex - 1);
        } else {
          toggleExpand(false);
        }
      } else if (event.key === "Home") {
        focusItemAt(0);
      } else if (event.key === "End") {
        focusItemAt(items.length - 1);
      } else if (event.key === "Enter" || event.key === " ") {
        if (!activeItem.disabled) {
          this.selectItem(activeItem);
        }
      }
    }
  }
  handleClick(event) {
    const target = event.target;
    const treeItem = target.closest("sl-tree-item");
    const isExpandButton = event.composedPath().some((el) => {
      var _a;
      return (_a = el == null ? void 0 : el.classList) == null ? void 0 : _a.contains("tree-item__expand-button");
    });
    if (!treeItem || treeItem.disabled || target !== this.clickTarget) {
      return;
    }
    if (isExpandButton) {
      treeItem.expanded = !treeItem.expanded;
    } else {
      this.selectItem(treeItem);
    }
  }
  handleMouseDown(event) {
    this.clickTarget = event.target;
  }
  handleSlotChange() {
    const items = this.getAllTreeItems();
    items.forEach(this.initTreeItem);
  }
  async handleSelectionChange() {
    const isSelectionMultiple = this.selection === "multiple";
    const items = this.getAllTreeItems();
    this.setAttribute("aria-multiselectable", isSelectionMultiple ? "true" : "false");
    for (const item of items) {
      item.selectable = isSelectionMultiple;
    }
    if (isSelectionMultiple) {
      await this.updateComplete;
      [...this.querySelectorAll(":scope > sl-tree-item")].forEach(
        (treeItem) => syncCheckboxes(treeItem, true)
      );
    }
  }
  /** @internal Returns the list of tree items that are selected in the tree. */
  get selectedItems() {
    const items = this.getAllTreeItems();
    const isSelected = (item) => item.selected;
    return items.filter(isSelected);
  }
  /** @internal Gets focusable tree items in the tree. */
  getFocusableItems() {
    const items = this.getAllTreeItems();
    const collapsedItems = /* @__PURE__ */ new Set();
    return items.filter((item) => {
      var _a;
      if (item.disabled) return false;
      const parent = (_a = item.parentElement) == null ? void 0 : _a.closest("[role=treeitem]");
      if (parent && (!parent.expanded || parent.loading || collapsedItems.has(parent))) {
        collapsedItems.add(item);
      }
      return !collapsedItems.has(item);
    });
  }
  render() {
    return x`
      <div
        part="base"
        class="tree"
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
        @mousedown=${this.handleMouseDown}
      >
        <slot @slotchange=${this.handleSlotChange}></slot>
        <span hidden aria-hidden="true"><slot name="expand-icon"></slot></span>
        <span hidden aria-hidden="true"><slot name="collapse-icon"></slot></span>
      </div>
    `;
  }
};
SlTree.styles = [component_styles_default, tree_styles_default];
__decorateClass([
  e("slot:not([name])")
], SlTree.prototype, "defaultSlot", 2);
__decorateClass([
  e("slot[name=expand-icon]")
], SlTree.prototype, "expandedIconSlot", 2);
__decorateClass([
  e("slot[name=collapse-icon]")
], SlTree.prototype, "collapsedIconSlot", 2);
__decorateClass([
  n()
], SlTree.prototype, "selection", 2);
__decorateClass([
  watch("selection")
], SlTree.prototype, "handleSelectionChange", 1);

export {
  SlTree
};
