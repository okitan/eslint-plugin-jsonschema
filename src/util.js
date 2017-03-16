"use strict"

const jsonPrefix = "var json = "

export const wrapJson = text => {
  return jsonPrefix + text
}

export const unwrapJson = text => {
  return text.substring(jsonPrefix.length)
}
