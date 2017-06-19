"use strict"

import { unwrapJson } from "../util"
import RefContext     from "../refContext"
import jsonpointer    from "jsonpointer"

function isObject(v) {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function traverseRef(schema, cb) {
  if (isObject(schema)) {
    const ref = schema["$ref"];
    if (ref) cb(ref);

    for (const key of Object.keys(schema)) {
      traverseRef(schema[key], cb)
    }
  } else if (Array.isArray(schema)) {
    for (const val of schema) {
      traverseRef(val, cb)
    }
  }
}

export const meta = {
  docs: {
    description: "check $ref is valid",
    category: "ref",
    recommended: true,
  },
  fixable: null,
}

export const create = context => {
  let json = unwrapJson(context.getSourceCode().getText())

  let targetSchema
  try {
    targetSchema = JSON.parse(json);
  } catch(err) {
    // Do nothing for invalid json
    return {}
  }

  traverseRef(targetSchema, ref => {
    const [id, pointer] = ref.split("#")

    let passed;
    if (id) {
      passed = RefContext.contains(context, ref);
    } else {
      passed = jsonpointer.get(targetSchema, pointer);
    }

    if (!passed) {
      // TODO
      context.report({
        message: `cannot resolve ref: ${ref}`,
        loc: {
          start: { line: 1, column: 0 },
          end:   { line: 1, column: 0 },
        },
      })
    }
  });

  return {}
}
