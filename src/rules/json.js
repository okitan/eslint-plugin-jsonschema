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
    let position = parseInt(err.message.match(/(\d+)/)[0]);

    let length = 0;
    let lines = json.split("\n");
    for (let i in lines) {
      let line = lines[i];
      if (length <= position && length + line.length + 1 >= position) {
        context.report({
          message: err.message,
          loc: {
            start: { line: i, column: position - length },
            end:   { line: i, column: position - length }
          }
        });
        break;
      }
      length += line.length + 1; // "\n"
    }
    return {}
  }

  return {}
}
