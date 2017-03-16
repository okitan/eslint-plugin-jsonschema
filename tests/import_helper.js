"use strict"

import requireIndex from "requireindex"

// npm run test:watch tests against es6
let dir = process.env["SOURCE_DIR"] || "lib"

export const ast = require(`../${dir}/ast`)

export const eslintPluginJsonschema = require(`../${dir}`)
export const rules = requireIndex(__dirname + `/../${dir}/rules`)
