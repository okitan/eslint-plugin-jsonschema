"use strict"

export default {
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
