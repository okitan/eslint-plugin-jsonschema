"use strict"

// npm run test:watch tests against es6
let dir = process.env["SOURCE_DIR"] || "lib"

export const eslintPluginJsonschema = require(`../${dir}`).default
