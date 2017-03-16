"use strict"

import { calculateJsonPointer } from "../ast"
import { unwrapJson }           from "../util"

import Ajv from "ajv"

import fs  from "fs"

export const meta = {
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

  // helpers
  const createMessage = error => {
    if (error.keyword == "additionalProperties" && error.dataPath == "") {
      return `instance ${error.message} ${error.params.additionalProperty}`
    }
    return error.dataPath + " " + error.message
  }

  const onNode = (errors, node) => {
    let error = errors.find(error => {
      return (calculateJsonPointer(node)) == error.dataPath;
    })

    if (error) {
      let i = errors.findIndex(e => e !== error)
      errors.splice(i, 1)

      context.report({
        node,
        message: createMessage(error)
      });
    }
  }


  // validate
  let options = context.options[0] || {}
  
  let validator
  if (options.strict) {
    validator = new Ajv({ meta: false, allErrors: true, jsonPointers: true })
    validator.addMetaSchema(JSON.parse(fs.readFileSync(__dirname + "/../../schema/draft04-strict-schema.json")))
    validator.addMetaSchema(JSON.parse(fs.readFileSync(__dirname + "/../../schema/draft04-strict-hyper-schema.json")))
  } else {
    validator = new Ajv({ allErrors: true, jsonPointers: true })
    validator.addMetaSchema(JSON.parse(fs.readFileSync(__dirname + "/../../schema/draft-04/hyper-schema.json")))
  }

  let result = validator.validateSchema(targetSchema)
  if (result) {
    return {}
  }

  let errors  = validator.errors
  return {
    "Program:exit": node => {
      // report every errors which cannot handle
      errors.forEach(error => {
        context.report({
          node,
          message: createMessage(error)
        })
      })
    },
    ObjectExpression: onNode.bind(null, errors), // array element
    Property:         onNode.bind(null, errors), // object key
  }
}
