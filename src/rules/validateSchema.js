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

  // validate
  let validator = new Ajv({ allErrors: true, jsonPointers: true })

  // add schemas
  validator.addMetaSchema(JSON.parse(fs.readFileSync(__dirname + "/../../schema/draft-04/hyper-schema.json")))

  let result = validator.validateSchema(targetSchema)
  if (result) {
    return {}
  }

  let errors  = validator.errors
  return {
    "Program:exit": node => {
      if (errors.length > 0) {
        errors.forEach(error => {
          context.report({
            node,
            message: error.dataPath + " " + error.message
          })
        })
      }
    },
    Property: node => {
      var error = errors.find(error => {
        return (calculateJsonPointer(node)) == error.dataPath;
      })


      if (error) {
        errors = errors.filter(e => e !== error)
        context.report({
          node,
          message: error.dataPath + " " + error.message
        });
      }
    }
  }
}
