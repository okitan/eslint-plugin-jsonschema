"use strict"

import { unwrapJson } from "../util"

import Ajv from "ajv"

export const meta = {
  docs: {
    description: "check json is valid for jsonschema",
    category: "jsonschema",
    recommended: true
  },
  fixable: null,
}

export const create = context => {
  let json = unwrapJson(context.getSourceCode().getText())

  let targetSchema
  try {
    targetSchema = JSON.parse(json);
  } catch(err) {
    // Do nothing for invalid json
    return {}
  }

  // Helper
  var parentProperty = function(property) {
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
  }

  var calculateJsonPointer = function(node) {
    var stack  = [ node.key.value ];

    var target = parentProperty(node);
    while (target && target.key) { // root has no key
      stack.unshift(target.key.value);
      target = parentProperty(target);
    }

    return stack.join(".")
  }

  var findErrorForNode = function(node, error) {
    return ("." + calculateJsonPointer(node)) == error.dataPath;
  }

  // validate
  let validator = new Ajv({ allErrors: true, sourceCode: true })
  let result = validator.validateSchema(targetSchema)
  if (result) {
    return {}
  }

  return {
    Property: node => {
      var error = validator.errors.find(findErrorForNode.bind(undefined, node));

      if (error) {
        context.report({
          node,
          message: error.dataPath + " " + error.message
        });
      }
    }
  }
}
