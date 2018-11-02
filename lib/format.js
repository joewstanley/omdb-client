const _ = require('lodash')

function formatYear (year) {
  if (year && _.isString(year)) {
    year = year.split('-')
    if (year.length === 2) {
      let from = +year[0]
      let to = year[1] ? +year[1] : undefined
      return { from, to }
    } else {
      return +year
    }
  } else {
    return null
  }
}

function formatDate (date) {
  if (date && _.isString(date)) {
    const dateObj = new Date(date)
    if (!isNaN(dateObj)) {
      return dateObj
    } else {
      return null
    }
  } else {
    return null
  }
}

function formatInteger (integer) {
  if (integer && _.isString(integer)) {
    return parseInt(integer.replace(/,/g, ''))
  } else {
    return null
  }
}

function formatFloat (float) {
  if (float && _.isString(float)) {
    return parseFloat(float.replace(/,/g, ''))
  } else {
    return null
  }
}

function formatMoney (money) {
  if (money && _.isString(money)) {
    return parseFloat(money.replace(/,|\$/g, ''))
  } else {
    return null
  }
}

function formatRatio (ratio) {
  if (ratio && _.isString(ratio)) {
    if (/\d+(\.\d+)?%/.test(ratio)) {
      return parseFloat(ratio)
    } else if (/^\d+(\.\d+)?\/\d+(\.\d+)?$/.test(ratio)) {
      const nums = ratio.split('/')
      return parseFloat(nums[0]) / parseFloat(nums[1]) * 100
    } else {
      return null
    }
  } else {
    return null
  }
}

function formatBoolean (boolean) {
  if (boolean && _.isString(boolean)) {
    return boolean === 'True'
  } else {
    return null
  }
}

function formatList (list) {
  if (list && _.isString(list)) {
    return list.split(', ')
      .map(item => item.replace(/ \(.*\)/, ''))
  } else {
    return null
  }
}

function formatPoster (poster) {
  if (poster && _.isString(poster)) {
    return poster.replace(/\._V1_SX300\.jpg$/, '.jpg')
  } else {
    return null
  }
}

module.exports = {
  formatYear,
  formatDate,
  formatInteger,
  formatFloat,
  formatMoney,
  formatRatio,
  formatBoolean,
  formatList,
  formatPoster
}
