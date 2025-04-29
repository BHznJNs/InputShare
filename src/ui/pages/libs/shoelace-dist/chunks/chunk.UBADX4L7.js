import {
  b,
  w,
  x
} from "./chunk.OOP2EFQH.js";

// node_modules/lit-html/static.js
var a = Symbol.for("");
var o = (t) => {
  if ((t == null ? void 0 : t.r) === a) return t == null ? void 0 : t._$litStatic$;
};
var i = (t, ...r) => ({ _$litStatic$: r.reduce((r2, e, a2) => r2 + ((t2) => {
  if (void 0 !== t2._$litStatic$) return t2._$litStatic$;
  throw Error(`Value passed to 'literal' function must be a 'literal' result: ${t2}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`);
})(e) + t[a2 + 1], t[0]), r: a });
var l = /* @__PURE__ */ new Map();
var n = (t) => (r, ...e) => {
  const a2 = e.length;
  let s, i2;
  const n2 = [], u2 = [];
  let c2, $2 = 0, f = false;
  for (; $2 < a2; ) {
    for (c2 = r[$2]; $2 < a2 && void 0 !== (i2 = e[$2], s = o(i2)); ) c2 += s + r[++$2], f = true;
    $2 !== a2 && u2.push(i2), n2.push(c2), $2++;
  }
  if ($2 === a2 && n2.push(r[a2]), f) {
    const t2 = n2.join("$$lit$$");
    void 0 === (r = l.get(t2)) && (n2.raw = n2, l.set(t2, r = n2)), e = u2;
  }
  return t(r, ...e);
};
var u = n(x);
var c = n(b);
var $ = n(w);

export {
  i,
  u
};
/*! Bundled license information:

lit-html/static.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
