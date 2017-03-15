"use strict"

import { rules } from "../import_helper"
let rule = rules.json

import { RuleTester } from "eslint"
let ruleTester = new RuleTester()

let validJsons = [
  '{}',
  '{ "test": "json" }',
  '[]',
  '"a"',
  'null',
  '0',
]

let inValidJsons = [
  { code: 'a',            errors: [ { line: 0 } ] },
  { code: '{\n"a": a\n}', errors: [ { line: 1, column: 6 } ] },
]

ruleTester.run("jsonschema/json", rule, {
  // XXX:
  valid: validJsons.map(text => "var json = " + text),
  invalid: inValidJsons.map(invalid => Object.assign(invalid, { code: "var json = " + invalid.code }))
})
