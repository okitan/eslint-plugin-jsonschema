"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = exports.meta = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _util = require("../util");

var _refContext = require("../refContext");

var _refContext2 = _interopRequireDefault(_refContext);

var _jsonpointer = require("jsonpointer");

var _jsonpointer2 = _interopRequireDefault(_jsonpointer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var meta = exports.meta = {
  docs: {
    description: "check $ref is valid",
    category: "ref",
    recommended: true
  },
  fixable: null
};

var create = exports.create = function create(context) {
  var json = (0, _util.unwrapJson)(context.getSourceCode().getText());

  var targetSchema = void 0;
  try {
    targetSchema = JSON.parse(json);
  } catch (err) {
    // Do nothing for invalid json
    return {};
  }

  var onProperty = function onProperty(node) {
    if (node.key.value !== '$ref') return;

    var ref = node.value.value;

    var _ref$split = ref.split("#"),
        _ref$split2 = _slicedToArray(_ref$split, 2),
        id = _ref$split2[0],
        pointer = _ref$split2[1];

    var passed = void 0;
    if (id) {
      passed = _refContext2.default.contains(context, ref);
    } else {
      passed = _jsonpointer2.default.get(targetSchema, pointer);
    }

    if (!passed) {
      context.report({
        message: "cannot resolve ref: \"" + ref + "\"",
        node: node.value
      });
    }
  };

  return {
    Property: onProperty
  };
};