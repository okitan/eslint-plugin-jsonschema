"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var parentProperty = function parentProperty(property) {
  var candidate = property.parent;

  while (candidate) {
    if (candidate.type == "Property") {
      return candidate;
    }
    candidate = candidate.parent;
  }

  return null;
};

var calculateJsonPointer = exports.calculateJsonPointer = function calculateJsonPointer(node) {
  var stack = [node.key.value];

  var target = parentProperty(node);
  while (target && target.key) {
    // root has no key
    stack.unshift(target.key.value);
    target = parentProperty(target);
  }

  return "/" + stack.join("/");
};