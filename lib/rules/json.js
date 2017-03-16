"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = exports.meta = undefined;

var _util = require("../util");

var meta = exports.meta = {
  docs: {
    description: "check schema is valid json",
    category: "json",
    recommended: true
  },
  fixable: null
};

var create = exports.create = function create(context) {
  var json = (0, _util.unwrapJson)(context.getSourceCode().getText());

  try {
    JSON.parse(json);
  } catch (err) {
    // starts with 0
    var position = parseInt(err.message.match(/(\d+)/)[0]);

    if (position == 0) {
      context.report({
        message: err.message,
        loc: {
          start: { line: 1, column: 0 }, // but column actually reported + 1
          end: { line: 1, column: 0 }
        }
      });
    } else {
      var length = 0;
      json.split("\n").some(function (line, i) {
        var oldLength = length;
        length += line.length + 1; // "\n"
        if (length > position) {
          context.report({
            message: err.message,
            loc: {
              start: { line: i + 1, column: position - oldLength },
              end: { line: i + 1, column: position - oldLength }
            }
          });
          return true;
        }
      });
    }
  }

  return {};
};