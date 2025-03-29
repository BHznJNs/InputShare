import {
  f,
  r,
  u
} from "./chunk.OOP2EFQH.js";
import {
  __decorateClass,
  __privateAdd,
  __privateGet,
  __privateSet,
  __spreadProps,
  __spreadValues
} from "./chunk.W27M6RDR.js";

// node_modules/@lit/reactive-element/decorators/property.js
var o = { attribute: true, type: String, converter: u, reflect: false, hasChanged: f };
var r2 = (t2 = o, e3, r5) => {
  const { kind: n2, metadata: i } = r5;
  let s = globalThis.litPropertyMetadata.get(i);
  if (void 0 === s && globalThis.litPropertyMetadata.set(i, s = /* @__PURE__ */ new Map()), s.set(r5.name, t2), "accessor" === n2) {
    const { name: o2 } = r5;
    return { set(r6) {
      const n3 = e3.get.call(this);
      e3.set.call(this, r6), this.requestUpdate(o2, n3, t2);
    }, init(e4) {
      return void 0 !== e4 && this.P(o2, void 0, t2), e4;
    } };
  }
  if ("setter" === n2) {
    const { name: o2 } = r5;
    return function(r6) {
      const n3 = this[o2];
      e3.call(this, r6), this.requestUpdate(o2, n3, t2);
    };
  }
  throw Error("Unsupported decorator location: " + n2);
};
function n(t2) {
  return (e3, o2) => "object" == typeof o2 ? r2(t2, e3, o2) : ((t3, e4, o3) => {
    const r5 = e4.hasOwnProperty(o3);
    return e4.constructor.createProperty(o3, r5 ? __spreadProps(__spreadValues({}, t3), { wrapped: true }) : t3), r5 ? Object.getOwnPropertyDescriptor(e4, o3) : void 0;
  })(t2, e3, o2);
}

// node_modules/@lit/reactive-element/decorators/state.js
function r3(r5) {
  return n(__spreadProps(__spreadValues({}, r5), { state: true, attribute: false }));
}

// node_modules/@lit/reactive-element/decorators/event-options.js
function t(t2) {
  return (n2, o2) => {
    const c = "function" == typeof n2 ? n2 : n2[o2];
    Object.assign(c, t2);
  };
}

// node_modules/@lit/reactive-element/decorators/base.js
var e = (e3, t2, c) => (c.configurable = true, c.enumerable = true, Reflect.decorate && "object" != typeof t2 && Object.defineProperty(e3, t2, c), c);

// node_modules/@lit/reactive-element/decorators/query.js
function e2(e3, r5) {
  return (n2, s, i) => {
    const o2 = (t2) => {
      var _a, _b;
      return (_b = (_a = t2.renderRoot) == null ? void 0 : _a.querySelector(e3)) != null ? _b : null;
    };
    if (r5) {
      const { get: e4, set: r6 } = "object" == typeof s ? n2 : i != null ? i : (() => {
        const t2 = Symbol();
        return { get() {
          return this[t2];
        }, set(e5) {
          this[t2] = e5;
        } };
      })();
      return e(n2, s, { get() {
        let t2 = e4.call(this);
        return void 0 === t2 && (t2 = o2(this), (null !== t2 || this.hasUpdated) && r6.call(this, t2)), t2;
      } });
    }
    return e(n2, s, { get() {
      return o2(this);
    } });
  };
}

// node_modules/@lit/reactive-element/decorators/query-async.js
function r4(r5) {
  return (n2, e3) => e(n2, e3, { async get() {
    var _a, _b;
    return await this.updateComplete, (_b = (_a = this.renderRoot) == null ? void 0 : _a.querySelector(r5)) != null ? _b : null;
  } });
}

// src/internal/shoelace-element.ts
var _hasRecordedInitialProperties;
var ShoelaceElement = class extends r {
  constructor() {
    super();
    __privateAdd(this, _hasRecordedInitialProperties, false);
    // Store the constructor value of all `static properties = {}`
    this.initialReflectedProperties = /* @__PURE__ */ new Map();
    Object.entries(this.constructor.dependencies).forEach(([name, component]) => {
      this.constructor.define(name, component);
    });
  }
  emit(name, options) {
    const event = new CustomEvent(name, __spreadValues({
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: {}
    }, options));
    this.dispatchEvent(event);
    return event;
  }
  /* eslint-enable */
  static define(name, elementConstructor = this, options = {}) {
    const currentlyRegisteredConstructor = customElements.get(name);
    if (!currentlyRegisteredConstructor) {
      try {
        customElements.define(name, elementConstructor, options);
      } catch (_err) {
        customElements.define(name, class extends elementConstructor {
        }, options);
      }
      return;
    }
    let newVersion = " (unknown version)";
    let existingVersion = newVersion;
    if ("version" in elementConstructor && elementConstructor.version) {
      newVersion = " v" + elementConstructor.version;
    }
    if ("version" in currentlyRegisteredConstructor && currentlyRegisteredConstructor.version) {
      existingVersion = " v" + currentlyRegisteredConstructor.version;
    }
    if (newVersion && existingVersion && newVersion === existingVersion) {
      return;
    }
    console.warn(
      `Attempted to register <${name}>${newVersion}, but <${name}>${existingVersion} has already been registered.`
    );
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (!__privateGet(this, _hasRecordedInitialProperties)) {
      this.constructor.elementProperties.forEach(
        (obj, prop) => {
          if (obj.reflect && this[prop] != null) {
            this.initialReflectedProperties.set(prop, this[prop]);
          }
        }
      );
      __privateSet(this, _hasRecordedInitialProperties, true);
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }
  willUpdate(changedProperties) {
    super.willUpdate(changedProperties);
    this.initialReflectedProperties.forEach((value, prop) => {
      if (changedProperties.has(prop) && this[prop] == null) {
        this[prop] = value;
      }
    });
  }
};
_hasRecordedInitialProperties = new WeakMap();
/* eslint-disable */
// @ts-expect-error This is auto-injected at build time.
ShoelaceElement.version = "2.20.1";
ShoelaceElement.dependencies = {};
__decorateClass([
  n()
], ShoelaceElement.prototype, "dir", 2);
__decorateClass([
  n()
], ShoelaceElement.prototype, "lang", 2);

export {
  n,
  r3 as r,
  t,
  e2 as e,
  r4 as r2,
  ShoelaceElement
};
/*! Bundled license information:

@lit/reactive-element/decorators/property.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/state.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/event-options.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/base.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-async.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/custom-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-all.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
