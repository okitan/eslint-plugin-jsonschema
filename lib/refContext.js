"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _jsonpointer = require("jsonpointer");

var _jsonpointer2 = _interopRequireDefault(_jsonpointer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function iterateDirectory(dir, cb) {
  var paths = _fs2.default.readdirSync(dir);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = paths[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var path = _step.value;

      path = dir + "/" + path;
      var stat = _fs2.default.statSync(path);
      if (stat.isDirectory()) {
        iterateDirectory(path, cb);
      } else {
        cb(path);
      }
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
}

var RefContext = function () {
  function RefContext() {
    _classCallCheck(this, RefContext);

    this.cached = false;
    this.schemaMap = {};
  }

  _createClass(RefContext, [{
    key: "resolveDirs",
    value: function resolveDirs(contextDirectories) {
      if (this.cached) return;
      this.cached = true;

      var files = [];
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = contextDirectories[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var dir = _step2.value;

          iterateDirectory(dir, function (file) {
            // TODO: ext options?
            if (!file.match(/\.json/)) return;

            files.push(file);
          });
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

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = files[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var file = _step3.value;

          var schema = void 0;
          try {
            schema = JSON.parse(_fs2.default.readFileSync(file));
          } catch (e) {
            // skip
            continue;
          }

          var id = schema.id;
          if (!id) continue;

          var _id$split = id.split("#");

          var _id$split2 = _slicedToArray(_id$split, 1);

          id = _id$split2[0];


          this.schemaMap[id] = schema;
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  }, {
    key: "resolve",
    value: function resolve(context) {

      var contextDirectory = context.settings && context.settings["jsonschema"] && context.settings["jsonschema"]["schemaDirectory"];
      if (!contextDirectory) {
        contextDirectory = ["."];
      }
      if (typeof contextDirectory === "string") {
        contextDirectory = [contextDirectory];
      }

      this.resolveDirs(contextDirectory);
    }
  }, {
    key: "contains",
    value: function contains(context, ref) {
      this.resolve(context);

      var _ref$split = ref.split("#"),
          _ref$split2 = _slicedToArray(_ref$split, 2),
          _ref$split2$ = _ref$split2[0],
          id = _ref$split2$ === undefined ? "" : _ref$split2$,
          _ref$split2$2 = _ref$split2[1],
          pointer = _ref$split2$2 === undefined ? "" : _ref$split2$2;

      var schema = this.schemaMap[id];
      if (!schema) return false;

      return _jsonpointer2.default.get(schema, pointer) !== undefined;
    }
  }]);

  return RefContext;
}();

exports.default = new RefContext();