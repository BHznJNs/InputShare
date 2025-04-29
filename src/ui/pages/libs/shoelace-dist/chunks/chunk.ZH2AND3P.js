// src/internal/scrollend-polyfill.ts
var debounce = (fn, delay) => {
  let timerId = 0;
  return function(...args) {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(() => {
      fn.call(this, ...args);
    }, delay);
  };
};
var decorate = (proto, method, decorateFn) => {
  const superFn = proto[method];
  proto[method] = function(...args) {
    superFn.call(this, ...args);
    decorateFn.call(this, superFn, ...args);
  };
};
(() => {
  if (typeof window === "undefined") {
    return;
  }
  const isSupported = "onscrollend" in window;
  if (!isSupported) {
    const pointers = /* @__PURE__ */ new Set();
    const scrollHandlers = /* @__PURE__ */ new WeakMap();
    const handlePointerDown = (event) => {
      for (const touch of event.changedTouches) {
        pointers.add(touch.identifier);
      }
    };
    const handlePointerUp = (event) => {
      for (const touch of event.changedTouches) {
        pointers.delete(touch.identifier);
      }
    };
    document.addEventListener("touchstart", handlePointerDown, true);
    document.addEventListener("touchend", handlePointerUp, true);
    document.addEventListener("touchcancel", handlePointerUp, true);
    decorate(EventTarget.prototype, "addEventListener", function(addEventListener, type) {
      if (type !== "scrollend") return;
      const handleScrollEnd = debounce(() => {
        if (!pointers.size) {
          this.dispatchEvent(new Event("scrollend"));
        } else {
          handleScrollEnd();
        }
      }, 100);
      addEventListener.call(this, "scroll", handleScrollEnd, { passive: true });
      scrollHandlers.set(this, handleScrollEnd);
    });
    decorate(EventTarget.prototype, "removeEventListener", function(removeEventListener, type) {
      if (type !== "scrollend") return;
      const scrollHandler = scrollHandlers.get(this);
      if (scrollHandler) {
        removeEventListener.call(this, "scroll", scrollHandler, { passive: true });
      }
    });
  }
})();
