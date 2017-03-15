"use strict"

import requireIndex from "requireindex"

// npm run test:watch tests against es6
let dir = process.env["SOURCE_DIR"] || "lib"

export const eslintPluginJsonschema = require(`../${dir}`).default
export const rules = requireIndex(__dirname + `/../${dir}/rules`)
