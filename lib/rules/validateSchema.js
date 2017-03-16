"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = exports.meta = undefined;

var _util = require("../util");

var _ajv = require("ajv");

var _ajv2 = _interopRequireDefault(_ajv);

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

  // Helper
  var parentProperty = function parentProperty(property) {
    var parent = property.parent.parent;

    if (parent) {
      switch (parent.type) {
        case "ArrayExpression":
          return parent.parent;
        default:
          return parent;
      }
    }

    return undefined;
  };

  var calculateJsonPointer = function calculateJsonPointer(node) {
    var stack = [node.key.value];

    var target = parentProperty(node);
    while (target && target.key) {
      // root has no key
      stack.unshift(target.key.value);
      target = parentProperty(target);
    }

    return stack.join(".");
  };

  var findErrorForNode = function findErrorForNode(node, error) {
    return "." + calculateJsonPointer(node) == error.dataPath;
  };

  // validate
  var validator = new _ajv2.default({ allErrors: true, sourceCode: true });
  var result = validator.validateSchema(targetSchema);
  if (result) {
    return {};
  }

  return {
    Property: function Property(node) {
      var error = validator.errors.find(findErrorForNode.bind(undefined, node));

      if (error) {
        context.report({
          node: node,
          message: error.dataPath + " " + error.message
        });
      }
    }
  };
};