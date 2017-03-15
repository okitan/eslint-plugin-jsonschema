"use strict"

import { rules } from "../import_helper"
let rule = rules.valid

import { RuleTester } from "eslint"
let ruleTester = new RuleTester()

describe("jsonschema/validate", () => {
  let validSchemas = [
    '{}'
  ]

  let inValidSchemas = [
    { code: '{ "id": 0 }',  errors: [ { line: 1, columun: 9 } ] },
    { code: '{ "id": 0, "properties": 0 }', errors: 2 }
  ]

  ruleTester.run("against json hyper schema", rule, {
    // XXX:
    valid: validSchemas.map(text => "var json = " + text),
    invalid: inValidSchemas.map(invalid => Object.assign(invalid, { code: "var json = " + invalid.code }))
  })
})
