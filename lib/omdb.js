const axios = require('axios')
const joi = require('joi')

const config = require('./config')
const utils = require('./utils')

const searchSchema = joi.object().keys({
  key: joi.string().min(1).required(),
  search: joi.string().min(1).required(),
  type: joi.string().valid(config.resultTypes),
  year: joi.number().integer().min(config.minYear).max(config.maxYear),
  page: joi.number().integer().min(config.minPage).max(config.maxPage)
})

const getSchema = joi.object().keys({
  key: joi.string().min(1).required(),
  id: joi.string().regex(/^tt\d+$/, 'imdb'),
  title: joi.string().min(1),
  season: joi.number().integer().min(1),
  episode: joi.number().integer().min(1),
  type: joi.string().valid(config.resultTypes),
  year: joi.number().integer().min(config.minYear).max(config.maxYear),
  plot: joi.number().integer().min(config.minPage).max(config.maxPage)
}).xor('id', 'title')

const posterSchema = joi.object().keys({
  key: joi.string().min(1).required(),
  id: joi.string().regex(/^tt\d+$/, 'imdb').required()
})

function validate (options, schema, map) {
  const validationResult = utils.validateOptions(options, schema)
  if (!validationResult.valid) {
    throw validationResult.error
  } else {
    return utils.mapOptions(options, map)
  }
}

function request (host, params, raw = false) {
  const responseType = raw ? 'stream' : 'json' 
  return axios.get(host, { params, responseType })
    .then(res => {
      console.log(res.url)
      if (res.status !== 200) {
        throw new Error(res.statusText)
      } else if (res.data.Error) {
        throw new Error(res.data.Error)
      } else {
        return raw ? res.data : utils.formatResponse(res.data, config.format)
      }
    })
    .catch(err =>{
      throw err
    })
}

function search (options) {
  const schema = searchSchema
  const map = config.map.search
  const host = config.dataHost
  return request(host, validate(options, schema, map))
}

function get (options) {
  const schema = getSchema
  const map = config.map.get
  const host = config.dataHost
  return request(host, validate(options, schema, map))
}

function poster (options) {
  const schema = posterSchema
  const map = config.map.poster
  const host = config.imgHost
  return request(host, validate(options, schema, map), true)
}

module.exports = {
  search,
  get,
  poster
}
