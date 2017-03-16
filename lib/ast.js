"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var calculateJsonPointer = exports.calculateJsonPointer = function calculateJsonPointer(node) {
  var stack = "";
  var parent = node.parent;

  if (node.type == "Property") {
    stack += node.key.value;
  }

  if (parent) {
    if (parent.type == "ObjectExpression") {
      stack = "/" + stack;
    }

    if (parent.type == "ArrayExpression") {
      var i = parent.elements.findIndex(function (e) {
        return e == node;
      });
      stack = "/" + i + stack;
    }

    return calculateJsonPointer(parent) + stack;
  } else {
    return stack;
  }
};