'use strict'

/**
 * node-csp
 * Copyright(c) 2016-2016 Harminder Virk
 * http://www.kayako.com/license
*/

const platform = require('platform')
const headers = require('./headers')

let Csp = exports = module.exports = {}

/**
 * Add quotes to below keywords
 * @example
 * self becomes 'self'
 * @type {RegExp}
 */
const keywords = /(none|self|unsafe-inline|unsafe-eval)/g

/**
 * @description list of allowed directives by all browsers
 * @type {Array}
 */
const directivesList = [
  'base-uri',
  'child-src',
  'connect-src',
  'default-src',
  'font-src',
  'form-action',
  'frame-ancestors',
  'frame-src',
  'img-src',
  'media-src',
  'object-src',
  'plugin-types',
  'report-uri',
  'style-src',
  'script-src',
  'upgrade-insecure-requests'
]

/**
 * @description adds csp policy to http response
 * @method add
 * @param  {Object} request
 * @param  {Object} response
 * @param  {Ojbect} options
 * @public
 */
Csp.add = function (request, response, options) {
  const cspHeaders = Csp.build(request, options)
  const headerKeys = Object.keys(cspHeaders)
  if(headerKeys.length) {
    headerKeys.forEach(function (key) {
      response.setHeader(key, cspHeaders[key])
    })
  }
}

/**
 * @description builds the final object to be used
 * by response for adding csp header
 * @method build
 * @param  {Object} request
 * @param  {Object} options
 * @return {Object}
 * @public
 */
Csp.build = function (request, options) {
  const userAgent = request.headers['user-agent']
  let cspHeaders = headers.getAllHeaders()

  if(userAgent && !options.setAllHeaders) {
    const browser = platform.parse(userAgent) || {}
    cspHeaders = typeof(headers[browser.name]) === 'function' ? headers[browser.name](browser, options) : headers.getAllHeaders()
  }

  if(!cspHeaders.length) {
    return {}
  }

  const cspString = Csp._quoteKeywords(Csp._formatDirectives(options.directives))

  if(cspString.trim().length <= 0) {
    return {}
  }

  let cspBuildHeaders = {}
  cspHeaders.forEach(function (headerKey) {
    if(options.reportOnly) {
      headerKey += '-Report-Only'
    }
    cspBuildHeaders[headerKey] = cspString
  })

  return cspBuildHeaders
}

/**
 * @description format directives objects to a string
 * to be consumed by web browsers.
 * @method _formatDirectives
 * @param  {Object}          directives
 * @return {String}
 * @public
 */
Csp._formatDirectives = function (directives) {
  const directiveNames = Object.keys(directives)
  let cspString = ''
  directiveNames.forEach(function (name) {
    const directive = directives[name]
    if(directivesList.indexOf(name) <= -1) {
      throw new Error(`invalid directive: ${name}`)
    }
    cspString += `${name} ${directive.join(' ')}; `
  })
  return cspString
}

/**
 * @description add quotes to special keywords using
 * regex.
 * @method _quoteKeywords
 * @param  {String}       cspString
 * @return {String}
 * @public
 */
Csp._quoteKeywords = function (cspString) {
  return cspString.replace(keywords, function (index, group) {
    return `'${group}'`
  })
}