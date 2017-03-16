"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = exports.meta = undefined;

var _ast = require("../ast");

var _util = require("../util");

var _ajv = require("ajv");

var _ajv2 = _interopRequireDefault(_ajv);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var meta = exports.meta = {
  docs: {
    description: "check json is valid for jsonschema",
    category: "jsonschema",
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

  // validate
  var validator = new _ajv2.default({ allErrors: true, jsonPointers: true });

  // add schemas
  validator.addMetaSchema(JSON.parse(_fs2.default.readFileSync(__dirname + "/../../schema/draft-04/hyper-schema.json")));

  var result = validator.validateSchema(targetSchema);
  if (result) {
    return {};
  }

  var errors = validator.errors;
  return {
    "Program:exit": function ProgramExit(node) {
      if (errors.length > 0) {
        errors.forEach(function (error) {
          context.report({
            node: node,
            message: error.dataPath + " " + error.message
          });
        });
      }
    },
    Property: function Property(node) {
      var error = errors.find(function (error) {
        return (0, _ast.calculateJsonPointer)(node) == error.dataPath;
      });

      if (error) {
        errors = errors.filter(function (e) {
          return e !== error;
        });
        context.report({
          node: node,
          message: error.dataPath + " " + error.message
        });
      }
    }
  };
};