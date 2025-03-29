import {
  formCollections
} from "./chunk.E5624Z63.js";

// src/utilities/form.ts
function serialize(form) {
  const formData = new FormData(form);
  const object = {};
  formData.forEach((value, key) => {
    if (Reflect.has(object, key)) {
      const entry = object[key];
      if (Array.isArray(entry)) {
        entry.push(value);
      } else {
        object[key] = [object[key], value];
      }
    } else {
      object[key] = value;
    }
  });
  return object;
}
function getFormControls(form) {
  const rootNode = form.getRootNode();
  const allNodes = [...rootNode.querySelectorAll("*")];
  const formControls = [...form.elements];
  const collection = formCollections.get(form);
  const shoelaceFormControls = collection ? Array.from(collection) : [];
  return [...formControls, ...shoelaceFormControls].sort((a, b) => {
    if (allNodes.indexOf(a) < allNodes.indexOf(b)) return -1;
    if (allNodes.indexOf(a) > allNodes.indexOf(b)) return 1;
    return 0;
  });
}

export {
  serialize,
  getFormControls
};
