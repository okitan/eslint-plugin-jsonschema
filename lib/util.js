"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var jsonPrefix = "var json = ";

var wrapJson = exports.wrapJson = function wrapJson(text) {
  return jsonPrefix + text;
};

var unwrapJson = exports.unwrapJson = function unwrapJson(text) {
  return text.substring(jsonPrefix.length);
};