"use strict"

export const calculateJsonPointer = (node) => {
  let stack  = ""
  let parent = node.parent

  if (node.type == "Property") {
    stack += node.key.value
  }

  if (parent) {
    if (parent.type == "ObjectExpression") {
      stack = "/" + stack
    }

    if (parent.type == "ArrayExpression") {
      let i = parent.elements.findIndex(e => e == node)
      stack = "/" + i + stack
    }

    return calculateJsonPointer(parent) + stack
  } else {
    return stack
  }
}
