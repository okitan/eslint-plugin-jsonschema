"use strict"

const parentProperty = (property) => {
  let candidate = property.parent

  while (candidate) {
    if (candidate.type == "Property") {
      return candidate
    }
    candidate = candidate.parent
  }

  return null
}

export const calculateJsonPointer = (node) => {
  let stack = [ node.key.value ]

  let target = parentProperty(node)
  while (target && target.key) { // root has no key
    stack.unshift(target.key.value)
    target = parentProperty(target)
  }

  return "/" + stack.join("/")
}
