import {
  e,
  i,
  t
} from "./chunk.UP75L23G.js";
import {
  T
} from "./chunk.OOP2EFQH.js";

// node_modules/lit-html/directives/class-map.js
var e2 = e(class extends i {
  constructor(t2) {
    var _a;
    if (super(t2), t2.type !== t.ATTRIBUTE || "class" !== t2.name || ((_a = t2.strings) == null ? void 0 : _a.length) > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
  }
  render(t2) {
    return " " + Object.keys(t2).filter((s) => t2[s]).join(" ") + " ";
  }
  update(s, [i2]) {
    var _a, _b;
    if (void 0 === this.st) {
      this.st = /* @__PURE__ */ new Set(), void 0 !== s.strings && (this.nt = new Set(s.strings.join(" ").split(/\s/).filter((t2) => "" !== t2)));
      for (const t2 in i2) i2[t2] && !((_a = this.nt) == null ? void 0 : _a.has(t2)) && this.st.add(t2);
      return this.render(i2);
    }
    const r = s.element.classList;
    for (const t2 of this.st) t2 in i2 || (r.remove(t2), this.st.delete(t2));
    for (const t2 in i2) {
      const s2 = !!i2[t2];
      s2 === this.st.has(t2) || ((_b = this.nt) == null ? void 0 : _b.has(t2)) || (s2 ? (r.add(t2), this.st.add(t2)) : (r.remove(t2), this.st.delete(t2)));
    }
    return T;
  }
});

export {
  e2 as e
};
/*! Bundled license information:

lit-html/directives/class-map.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
