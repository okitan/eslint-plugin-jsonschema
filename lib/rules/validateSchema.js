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
  // schema: [
  //   {
  //     type: "object",
  //     properties: {
  //       strict: {
  //         type: "boolean"
  //       }
  //     },
  //     additionalProperties: false
  //   }
  // ],
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

  // helpers
  var createMessage = function createMessage(error) {
    var verbose = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var target = error.dataPath;

    if (error.dataPath == "") {
      target = "instance";
    }

    // optional info
    var option = "";
    if (error.keyword == "additionalProperties") {
      option = error.params.additionalProperty;
    }

    return error.schemaPath + ": " + [target, error.message, option].filter(function (text) {
      return text;
    }).join(" ");
  };

  var onNode = function onNode(errors, node) {
    var error = errors.find(function (error) {
      return (0, _ast.calculateJsonPointer)(node) == error.dataPath;
    });

    if (error) {
      var i = errors.findIndex(function (e) {
        return e !== error;
      });
      errors.splice(i, 1);

      context.report({
        node: node,
        message: createMessage(error)
      });
    }
  };

  // validate
  var options = context.options[0] || {};

  var validator = void 0;
  if (options.strict) {
    validator = new _ajv2.default({ meta: false, allErrors: true, jsonPointers: true });
    validator.addMetaSchema(JSON.parse(_fs2.default.readFileSync(__dirname + "/../../schema/draft04-strict-schema.json")));
    validator.addMetaSchema(JSON.parse(_fs2.default.readFileSync(__dirname + "/../../schema/draft04-strict-hyper-schema.json")));
  } else {
    validator = new _ajv2.default({ allErrors: true, jsonPointers: true });
    validator.addMetaSchema(JSON.parse(_fs2.default.readFileSync(__dirname + "/../../schema/draft-04/hyper-schema.json")));
  }

  var result = validator.validateSchema(targetSchema);
  if (result) {
    return {};
  }

  var errors = validator.errors;
  return {
    "Program:exit": function ProgramExit(node) {
      // report every errors which cannot handle
      errors.forEach(function (error) {
        context.report({
          node: node,
          message: createMessage(error)
        });
      });
    },
    ObjectExpression: onNode.bind(null, errors), // array element
    Property: onNode.bind(null, errors) };
};