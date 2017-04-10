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
  const createMessage = (error, verbose = false) => {
    let target = error.dataPath

    if (error.dataPath == "") {
      target = "instance"
    }

    // optional info
    let option = ""
    if (error.keyword == "additionalProperties") {
      option = error.params.additionalProperty
    }

    return `${error.schemaPath}: ${[ target, error.message, option ].filter(text => text).join(" ")}`
  }

  const onNode = (errors, node) => {
    let i = errors.findIndex(error => {
      return (calculateJsonPointer(node)) == error.dataPath;
    })

    if (i >= 0) {
      let error = errors[i]
      errors.splice(i, 1)

      context.report({
        node,
        message: createMessage(error)
      })

      // do check errors again
      onNode(errors, node)
    }
  }


  // validate
  let options = context.options[0] || {}

  let validator = new Ajv({ meta: false, allErrors: true, jsonPointers: true })

  // add Schema
  let schema      = JSON.parse(fs.readFileSync(__dirname + "/../../schema/draft-04/schema.json"))
  let hyperSchema = JSON.parse(fs.readFileSync(__dirname + "/../../schema/draft-04/hyper-schema.json"))
  if (options.strict) {
    schema.properties.format    = { type: "string" }
    schema.properties["$ref"]   = { type: "string" }
    schema.additionalProperties = false

    // merge allOf of hyper-schema
    delete hyperSchema["allOf"]
    hyperSchema.definitions = Object.assign({}, schema.definitions, hyperSchema.definitions)
    hyperSchema.properties  = Object.assign({}, schema.properties,  hyperSchema.properties)

    hyperSchema.properties.readOnly  = { type: "boolean" }
    hyperSchema.additionalProperties = false
  }

  validator.addMetaSchema(schema)
  validator.addMetaSchema(hyperSchema)


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
