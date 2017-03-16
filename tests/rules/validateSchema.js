"use strict"

import { rules } from "../import_helper"
let rule = rules.validateSchema

import { RuleTester } from "eslint"
let ruleTester = new RuleTester()

describe("jsonschema/validateSchema", () => {
  let validSchemas = [
    '{}',
    '{ "id": "1" }',
    '{ "links": 0 }',      // in default it is treated as schema draft-04
    '{ "typo": "object" }' // off course typo is OK
  ]

  let inValidSchemas = [
    { code: '{ "id": 0 }',  errors: [ { message: "#/properties/id/type: /id should be string", line: 1, columun: 9 } ] },
    { code: '{\n  "properties": {\n    "hoge": 0\n  }\n}', errors: [ { line: 3 }] }, // nested property
    { code: '{\n  "$schema": "http://json-schema.org/draft-04/hyper-schema#",\n  "links": 0\n}', errors: [ { line: 3 }] },
    { code: '{\n  "$schema": "http://json-schema.org/draft-04/hyper-schema#",\n  "links": [\n    { "href": "/" }\n  ]\n}', errors: [ { line: 4 }] }, // /links/0
    { code: '{ "id": 0, "properties": 0 }', errors: 2 }, // multiple errors
  ]

  ruleTester.run("against json hyper schema", rule, {
    // XXX:
    valid: validSchemas.map(text => "var json = " + text),
    invalid: inValidSchemas.map(invalid => Object.assign(invalid, { code: "var json = " + invalid.code }))
  })

  let strictSchemas = [
    '{ "id": "1" }',
  ]

  let typoSchemas = [
    { code: '{ "$schema": "http://json-schema.org/draft-04/hyper-schema#", "typo": "object" }', errors: [ { line: 1, message: "#/additionalProperties: instance should NOT have additional properties typo" }] },
  ]

  ruleTester.run("against json hyper schema", rule, {
    // XXX:
    valid:   strictSchemas.map(text  => { return { options: [ { strict: true } ], code: "var json = " + text } }),
    invalid: typoSchemas.map(invalid => Object.assign(invalid, { options: [ { strict: true } ], code: "var json = " + invalid.code }))
  })
})
