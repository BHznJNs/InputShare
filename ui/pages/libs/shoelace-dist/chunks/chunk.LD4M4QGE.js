// src/internal/closeActiveElement.ts
var blurActiveElement = (elm) => {
  var _a;
  const { activeElement } = document;
  if (activeElement && elm.contains(activeElement)) {
    (_a = document.activeElement) == null ? void 0 : _a.blur();
  }
};

export {
  blurActiveElement
};
