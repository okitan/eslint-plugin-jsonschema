"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processors = exports.rules = undefined;

var _util = require("./util");

var _requireindex = require("requireindex");

var _requireindex2 = _interopRequireDefault(_requireindex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rules = exports.rules = (0, _requireindex2.default)(__dirname + "/rules");

var processors = exports.processors = {
  ".json": {
    preprocess: function preprocess(text, fileName) {
      return [(0, _util.wrapJson)(text)];
    },
    postprocess: function postprocess(messages, fileName) {
      return messages[0];
    }
  }
};