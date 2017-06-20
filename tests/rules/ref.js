"use strict"

import { rules, RefContext } from "../import_helper"
let rule = rules.ref

import { RuleTester } from "eslint"
let ruleTester = new RuleTester()

let validJsons = [
  '{ "$ref": "#" }',
  '{ "definitions": { "foo": { "type": "string" }, "bar": { "$ref": "#/definitions/foo" } } }',
  '{ "$ref": "http://json-schema.org/draft-04/schema#" }',
  '{ "$ref": "http://json-schema.org/draft-04/schema#/definitions/schemaArray" }',
]

let inValidJsons = [
  {
    code: '{ "$ref": "#/" }',
    errors: [ { message: 'cannot resolve ref: "#/"',  line: 1 } ],
  },
  {
    code: '{ "$ref": "#/definitions/foo" }',
    errors: [ { message: 'cannot resolve ref: "#/definitions/foo"',  line: 1 } ],
  },
  {
    code: '{  "$ref": "http://json-schema.org/draft-04/schema#/" }',
    errors: [ { message: 'cannot resolve ref: "http://json-schema.org/draft-04/schema#/"', line: 1 } ],
  },
]

RefContext.resolveDirs([ __dirname + '/../../schema' ]);

ruleTester.run("jsonschema/ref", rule, {
  // XXX:
  valid: validJsons.map(text => "var json = " + text),
  invalid: inValidJsons.map(invalid => Object.assign(invalid, { code: "var json = " + invalid.code }))
})
