"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var meta = exports.meta = {
  docs: {
    description: "check schema is valid json",
    category: "json",
    recommended: true
  },
  fixable: null
};

var create = exports.create = function create(context) {
  var json = context.getSourceCode().getText().substring(11); // remove "var json = "

  try {
    JSON.parse(json);
  } catch (err) {
    var position = parseInt(err.message.match(/(\d+)/)[0]);

    var length = 0;
    var lines = json.split("\n");
    for (var i in lines) {
      var line = lines[i];
      if (length <= position && length + line.length + 1 >= position) {
        context.report({
          message: err.message,
          loc: {
            start: { line: i, column: position - length },
            end: { line: i, column: position - length }
          }
        });
        break;
      }
      length += line.length + 1; // "\n"
    }
    return {};
  }

  return {};
};