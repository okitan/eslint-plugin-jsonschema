"use strict"

import { wrapJson } from "./util"

import requireIndex from "requireindex"

export default {
  rules: requireIndex(__dirname + "/rules"),
  processors: {
    ".json": {
      preprocess: (text, fileName) => {
        return [ wrapJson(text) ]
      },
      postprocess: (messages, fileName) => {
        return messages[0]
      }
    }
  }
}
