"use strict"

export const meta = {
  docs: {
    description: "check schema is valid json",
    category: "json",
    recommended: true
  },
  fixable: null,
}

export const create = context => {
  let json = context.getSourceCode().getText().substring(11) // remove "var json = "

  try {
    JSON.parse(json)
  } catch(err) {
    // starts with 0
    let position = parseInt(err.message.match(/(\d+)/)[0])

    if (position == 0) {
      context.report({
        message: err.message,
        loc: {
          start: { line: 1, column: 0 }, // but column actually reported + 1
          end:   { line: 1, column: 0 }
        }
      })
    } else {
      let length = 0;
      json.split("\n").some((line, i) => {
        let oldLength = length
        length += line.length + 1 // "\n"
        if (length > position) {
          context.report({
            message: err.message,
            loc: {
              start: { line: i + 1, column: position - oldLength },
              end:   { line: i + 1, column: position - oldLength }
            }
          })
          return true
        }
      })
    }
  }

  return {}
}
