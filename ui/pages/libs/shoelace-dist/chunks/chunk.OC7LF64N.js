import {
  split_panel_styles_default
} from "./chunk.LRJNU3Q5.js";
import {
  drag
} from "./chunk.ESELY2US.js";
import {
  clamp
} from "./chunk.HF7GESMZ.js";
import {
  o
} from "./chunk.ZTHCIXLL.js";
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

// src/components/split-panel/split-panel.component.ts
var SNAP_NONE = () => null;
var SlSplitPanel = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.isCollapsed = false;
    this.localize = new LocalizeController(this);
    this.positionBeforeCollapsing = 0;
    this.position = 50;
    this.vertical = false;
    this.disabled = false;
    // Returned when the property is queried, so that string 'snap's are preserved.
    this.snapValue = "";
    // Actually used for computing snap points. All string snaps are converted via `toSnapFunction`.
    this.snapFunction = SNAP_NONE;
    this.snapThreshold = 12;
  }
  /**
   * Converts a string containing either a series of fixed/repeated snap points (e.g. "repeat(20%)", "100px 200px 800px", or "10% 50% repeat(10px)") into a SnapFunction. `SnapFunction`s take in a `SnapFunctionOpts` and return the position that the split panel should snap to.
   *
   * @param snap - The snap string.
   * @returns a `SnapFunction` representing the snap string's logic.
   */
  toSnapFunction(snap) {
    const snapPoints = snap.split(" ");
    return ({ pos, size, snapThreshold, isRtl, vertical }) => {
      let newPos = pos;
      let minDistance = Number.POSITIVE_INFINITY;
      snapPoints.forEach((value) => {
        let snapPoint;
        if (value.startsWith("repeat(")) {
          const repeatVal = snap.substring("repeat(".length, snap.length - 1);
          const isPercent = repeatVal.endsWith("%");
          const repeatNum = Number.parseFloat(repeatVal);
          const snapIntervalPx = isPercent ? size * (repeatNum / 100) : repeatNum;
          snapPoint = Math.round((isRtl && !vertical ? size - pos : pos) / snapIntervalPx) * snapIntervalPx;
        } else if (value.endsWith("%")) {
          snapPoint = size * (Number.parseFloat(value) / 100);
        } else {
          snapPoint = Number.parseFloat(value);
        }
        if (isRtl && !vertical) {
          snapPoint = size - snapPoint;
        }
        const distance = Math.abs(pos - snapPoint);
        if (distance <= snapThreshold && distance < minDistance) {
          newPos = snapPoint;
          minDistance = distance;
        }
      });
      return newPos;
    };
  }
  set snap(snap) {
    this.snapValue = snap != null ? snap : "";
    if (snap) {
      this.snapFunction = typeof snap === "string" ? this.toSnapFunction(snap) : snap;
    } else {
      this.snapFunction = SNAP_NONE;
    }
  }
  get snap() {
    return this.snapValue;
  }
  connectedCallback() {
    super.connectedCallback();
    this.resizeObserver = new ResizeObserver((entries) => this.handleResize(entries));
    this.updateComplete.then(() => this.resizeObserver.observe(this));
    this.detectSize();
    this.cachedPositionInPixels = this.percentageToPixels(this.position);
  }
  disconnectedCallback() {
    var _a;
    super.disconnectedCallback();
    (_a = this.resizeObserver) == null ? void 0 : _a.unobserve(this);
  }
  detectSize() {
    const { width, height } = this.getBoundingClientRect();
    this.size = this.vertical ? height : width;
  }
  percentageToPixels(value) {
    return this.size * (value / 100);
  }
  pixelsToPercentage(value) {
    return value / this.size * 100;
  }
  handleDrag(event) {
    const isRtl = this.localize.dir() === "rtl";
    if (this.disabled) {
      return;
    }
    if (event.cancelable) {
      event.preventDefault();
    }
    drag(this, {
      onMove: (x2, y) => {
        var _a;
        let newPositionInPixels = this.vertical ? y : x2;
        if (this.primary === "end") {
          newPositionInPixels = this.size - newPositionInPixels;
        }
        newPositionInPixels = (_a = this.snapFunction({
          pos: newPositionInPixels,
          size: this.size,
          snapThreshold: this.snapThreshold,
          isRtl,
          vertical: this.vertical
        })) != null ? _a : newPositionInPixels;
        this.position = clamp(this.pixelsToPercentage(newPositionInPixels), 0, 100);
      },
      initialEvent: event
    });
  }
  handleKeyDown(event) {
    if (this.disabled) {
      return;
    }
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "Enter"].includes(event.key)) {
      let newPosition = this.position;
      const incr = (event.shiftKey ? 10 : 1) * (this.primary === "end" ? -1 : 1);
      event.preventDefault();
      if (event.key === "ArrowLeft" && !this.vertical || event.key === "ArrowUp" && this.vertical) {
        newPosition -= incr;
      }
      if (event.key === "ArrowRight" && !this.vertical || event.key === "ArrowDown" && this.vertical) {
        newPosition += incr;
      }
      if (event.key === "Home") {
        newPosition = this.primary === "end" ? 100 : 0;
      }
      if (event.key === "End") {
        newPosition = this.primary === "end" ? 0 : 100;
      }
      if (event.key === "Enter") {
        if (this.isCollapsed) {
          newPosition = this.positionBeforeCollapsing;
          this.isCollapsed = false;
        } else {
          const positionBeforeCollapsing = this.position;
          newPosition = 0;
          requestAnimationFrame(() => {
            this.isCollapsed = true;
            this.positionBeforeCollapsing = positionBeforeCollapsing;
          });
        }
      }
      this.position = clamp(newPosition, 0, 100);
    }
  }
  handleResize(entries) {
    const { width, height } = entries[0].contentRect;
    this.size = this.vertical ? height : width;
    if (isNaN(this.cachedPositionInPixels) || this.position === Infinity) {
      this.cachedPositionInPixels = Number(this.getAttribute("position-in-pixels"));
      this.positionInPixels = Number(this.getAttribute("position-in-pixels"));
      this.position = this.pixelsToPercentage(this.positionInPixels);
    }
    if (this.primary) {
      this.position = this.pixelsToPercentage(this.cachedPositionInPixels);
    }
  }
  handlePositionChange() {
    this.cachedPositionInPixels = this.percentageToPixels(this.position);
    this.isCollapsed = false;
    this.positionBeforeCollapsing = 0;
    this.positionInPixels = this.percentageToPixels(this.position);
    this.emit("sl-reposition");
  }
  handlePositionInPixelsChange() {
    this.position = this.pixelsToPercentage(this.positionInPixels);
  }
  handleVerticalChange() {
    this.detectSize();
  }
  render() {
    const gridTemplate = this.vertical ? "gridTemplateRows" : "gridTemplateColumns";
    const gridTemplateAlt = this.vertical ? "gridTemplateColumns" : "gridTemplateRows";
    const isRtl = this.localize.dir() === "rtl";
    const primary = `
      clamp(
        0%,
        clamp(
          var(--min),
          ${this.position}% - var(--divider-width) / 2,
          var(--max)
        ),
        calc(100% - var(--divider-width))
      )
    `;
    const secondary = "auto";
    if (this.primary === "end") {
      if (isRtl && !this.vertical) {
        this.style[gridTemplate] = `${primary} var(--divider-width) ${secondary}`;
      } else {
        this.style[gridTemplate] = `${secondary} var(--divider-width) ${primary}`;
      }
    } else {
      if (isRtl && !this.vertical) {
        this.style[gridTemplate] = `${secondary} var(--divider-width) ${primary}`;
      } else {
        this.style[gridTemplate] = `${primary} var(--divider-width) ${secondary}`;
      }
    }
    this.style[gridTemplateAlt] = "";
    return x`
      <slot name="start" part="panel start" class="start"></slot>

      <div
        part="divider"
        class="divider"
        tabindex=${o(this.disabled ? void 0 : "0")}
        role="separator"
        aria-valuenow=${this.position}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label=${this.localize.term("resize")}
        @keydown=${this.handleKeyDown}
        @mousedown=${this.handleDrag}
        @touchstart=${this.handleDrag}
      >
        <slot name="divider"></slot>
      </div>

      <slot name="end" part="panel end" class="end"></slot>
    `;
  }
};
SlSplitPanel.styles = [component_styles_default, split_panel_styles_default];
__decorateClass([
  e(".divider")
], SlSplitPanel.prototype, "divider", 2);
__decorateClass([
  n({ type: Number, reflect: true })
], SlSplitPanel.prototype, "position", 2);
__decorateClass([
  n({ attribute: "position-in-pixels", type: Number })
], SlSplitPanel.prototype, "positionInPixels", 2);
__decorateClass([
  n({ type: Boolean, reflect: true })
], SlSplitPanel.prototype, "vertical", 2);
__decorateClass([
  n({ type: Boolean, reflect: true })
], SlSplitPanel.prototype, "disabled", 2);
__decorateClass([
  n()
], SlSplitPanel.prototype, "primary", 2);
__decorateClass([
  n({ reflect: true })
], SlSplitPanel.prototype, "snap", 1);
__decorateClass([
  n({ type: Number, attribute: "snap-threshold" })
], SlSplitPanel.prototype, "snapThreshold", 2);
__decorateClass([
  watch("position")
], SlSplitPanel.prototype, "handlePositionChange", 1);
__decorateClass([
  watch("positionInPixels")
], SlSplitPanel.prototype, "handlePositionInPixelsChange", 1);
__decorateClass([
  watch("vertical")
], SlSplitPanel.prototype, "handleVerticalChange", 1);

export {
  SNAP_NONE,
  SlSplitPanel
};
