"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  processors: {
    ".json": {
      preprocess: function preprocess(text, fileName) {
        // TODO: DRY var json =
        var jsText = "var json = " + text;
        return [jsText];
      },
      postprocess: function postprocess(messages, fileName) {
        return messages[0];
      }
    }
  }
};