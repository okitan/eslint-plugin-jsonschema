"use strict"

import { rules } from "../import_helper"
let rule = rules.validateSchema

import { RuleTester } from "eslint"
let ruleTester = new RuleTester()

describe("jsonschema/validateSchema", () => {
  let validSchemas = [
    '{}',
    '{ "links": 0 }',      // in default it is treated as schema draft-04
    '{ "typo": "object" }' // off course typo is OK
  ]

  let inValidSchemas = [
    { code: '{ "id": 0 }',  errors: [ { line: 1, columun: 9 } ] },
    { code: '{ "id": 0, "properties": 0 }', errors: 2 },
    { code: '{\n  "properties": {\n    "hoge": 0\n  }\n}', errors: [ { line: 3 }] },
    { code: '{\n  "$schema": "http://json-schema.org/draft-04/hyper-schema#",\n  "links": 0\n}', errors: [ { line: 3 }] }
  ]

  ruleTester.run("against json hyper schema", rule, {
    // XXX:
    valid: validSchemas.map(text => "var json = " + text),
    invalid: inValidSchemas.map(invalid => Object.assign(invalid, { code: "var json = " + invalid.code }))
  })
})
