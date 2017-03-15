"use strict"

import { eslintPluginJsonschema } from "./import_helper"

import assert from "power-assert"

describe("eslint-plugin-jsonschema", () => {
  it("exports processor of json", () => {
    assert( ".json" in eslintPluginJsonschema.processors )
  })

  it("exports rules", () => {
    assert( "rules" in eslintPluginJsonschema )
  })
})
