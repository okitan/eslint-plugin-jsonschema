"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _requireindex = require("requireindex");

var _requireindex2 = _interopRequireDefault(_requireindex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  rules: (0, _requireindex2.default)(__dirname + "/rules"),
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