"use strict"

import { wrapJson } from "./util"

import requireIndex from "requireindex"

export const rules = requireIndex(__dirname + "/rules")

export const processors = {
  ".json": {
    preprocess: (text, fileName) => {
      return [ wrapJson(text) ]
    },
    postprocess: (messages, fileName) => {
      return messages[0]
    }
  }
}
