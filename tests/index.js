"use strict"

import a from "../lib"

import assert from "power-assert"

describe("eslint-plugin-jsonschema", () => {
  it("exports processor of json", () => {
    assert( ".json" in a.processors )
  })
})
