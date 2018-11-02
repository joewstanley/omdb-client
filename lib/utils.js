const joi = require('joi')
const _ = require('lodash')

const formatter = require('./format')

function validateOptions (options, schema) {
  const validationResult = joi.validate(options, schema)
  if (validationResult.error !== null) {
    return {
      valid: false,
      error: validationResult.error
    }
  } else {
    return { valid: true }
  }
}

function mapOptions (options, map) {
  return _.mapKeys(options, (val, key) => map[key])
}

function formatResponse (data, formatMap) {
  data = nullify(lowerKeys(data))
  return _.mapValues(data, (val, key) => {
    const format = formatMap[key]
    if (format === 'array') {
      return val.map(item => formatResponse(item, formatMap))
    } else {
      return format ? formatValue(val, format) : val
    }
  })
}

function formatValue (val, format) {
  const formatFuncName = `format${_.capitalize(format)}`
  const formatFunc = formatter[formatFuncName]
  if (formatFunc && _.isFunction(formatFunc)) {
    return formatFunc(val)
  } else {
    throw new Error(`Unkown format type: ${format}`)
  }
}

function lowerKeys (data) {
  return _.mapKeys(data, (val, key) => {
    return key.toUpperCase() === key ? key.toLowerCase() : _.lowerFirst(key)
  })
}

function nullify (data) {
  return _.mapValues(data, val => val === 'N/A' ? null : val)
}

module.exports = {
  validateOptions,
  mapOptions,
  formatResponse
}
