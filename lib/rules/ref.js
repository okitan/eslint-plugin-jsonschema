"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = exports.meta = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _util = require("../util");

var _refContext = require("../refContext");

var _refContext2 = _interopRequireDefault(_refContext);

var _jsonpointer = require("jsonpointer");

var _jsonpointer2 = _interopRequireDefault(_jsonpointer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isObject(v) {
  return (typeof v === "undefined" ? "undefined" : _typeof(v)) === 'object' && v !== null && !Array.isArray(v);
}

function traverseRef(schema, cb) {
  if (isObject(schema)) {
    var ref = schema["$ref"];
    if (ref) cb(ref);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = Object.keys(schema)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var key = _step.value;

        traverseRef(schema[key], cb);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  } else if (Array.isArray(schema)) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = schema[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var val = _step2.value;

        traverseRef(val, cb);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  }
}

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

  traverseRef(targetSchema, function (ref) {
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
      // TODO
      context.report({
        message: "cannot resolve ref: " + ref,
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 0 }
        }
      });
    }
  });

  return {};
};