"use strict"

import requireIndex from "requireindex"

export default {
  rules: requireIndex(__dirname + "/rules"),
  processors: {
    ".json": {
      preprocess: (text, fileName) => {
        // TODO: DRY var json =
        let jsText = "var json = " + text
        return [ jsText ]
      },
      postprocess: (messages, fileName) => {
        return messages[0]
      }
    }
  }
}
