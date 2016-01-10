'use strict'

/**
 * node-csp
 * Copyright(c) 2016-2016 Harminder Virk
 * MIT Licensed
*/

const chai = require('chai')
const expect = chai.expect
const Csp = require('../src/Csp')
const http = require('http')
const supertest = require('supertest')
require('co-mocha')

const oldOpera = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7.2; en; rv:2.0) Gecko/20100101 Firefox/4.0 Opera 11.52'
const latestChrome = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.93 Safari/537.36'
const unknownBrowser = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) G-Bot/27.0.1453.93 KBot/537.36'

describe('Csp', function () {
  it('should convert valid directives to a response header friendly string', function () {
    const directives = {
      'base-uri': ['self']
    }
    const cspString = Csp._formatDirectives(directives)
    expect(cspString).to.equal("base-uri self; ")
  })

  it('should throw an error when invalid directives has been passed', function () {
    const directives = {
      'foo-bar': ['self']
    }
    const cspString = function () {
      return Csp._formatDirectives(directives)
    }
    expect(cspString).to.throw("invalid directive: foo-bar")
  })

  it('should add quotation marks for csp keywords', function () {
    const directives = {
      'base-uri': ['self']
    }
    const cspString = Csp._formatDirectives(directives)
    const quotedString = Csp._quoteKeywords(cspString)
    expect(quotedString).to.equal("base-uri 'self'; ")
  })

  it('should not add quotation marks when there are no csp keywords', function () {
    const directives = {
      'base-uri': ['*.example.com']
    }
    const cspString = Csp._formatDirectives(directives)
    const quotedString = Csp._quoteKeywords(cspString)
    expect(quotedString).to.equal("base-uri *.example.com; ")
  })

  it('should add quotation marks to unsafe-eval', function () {
    const directives = {
      'script-src': ['unsafe-eval']
    }
    const cspString = Csp._formatDirectives(directives)
    const quotedString = Csp._quoteKeywords(cspString)
    expect(quotedString).to.equal("script-src 'unsafe-eval'; ")
  })

  it('should return empty object when csp is not supported by user agent', function () {
    const cspHeaders = Csp.build({headers:{'user-agent': oldOpera}}, {})
    expect(cspHeaders).deep.equal({})
  })

  it('should return proper headers when browser is latest chrome', function () {
    const directives = {
      'default-src': ['self', 'js.example.com']
    }
    const cspHeaders = Csp.build({headers:{'user-agent': latestChrome}}, {directives})
    expect(cspHeaders).deep.equal({'Content-Security-Policy': "default-src 'self' js.example.com; "})
  })

  it('should return empty object when no directives are defined', function () {
    const cspHeaders = Csp.build({headers:{'user-agent': latestChrome}}, {directives:{}})
    expect(cspHeaders).deep.equal({})
  })

  it('should set report only headers when report only is true', function () {
    const directives = {
      'default-src': ['self', 'js.example.com']
    }
    const cspHeaders = Csp.build({headers:{'user-agent': latestChrome}}, {directives, reportOnly: true})
    expect(cspHeaders).deep.equal({'Content-Security-Policy-Report-Only': "default-src 'self' js.example.com; "})
  })

  it('should return all headers when browser is unknown', function () {
    const directives = {
      'default-src': ['self', 'js.example.com']
    }
    const cspHeaders = Csp.build({headers:{'user-agent': unknownBrowser}}, {directives})
    expect(cspHeaders).to.have.property('Content-Security-Policy')
    expect(cspHeaders).to.have.property('X-Content-Security-Policy')
    expect(cspHeaders).to.have.property('X-WebKit-CSP')
  })

  it('should return all headers when there is no user agent', function () {
    const directives = {
      'default-src': ['self', 'js.example.com']
    }
    const cspHeaders = Csp.build({headers:{}}, {directives})
    expect(cspHeaders).to.have.property('Content-Security-Policy')
    expect(cspHeaders).to.have.property('X-Content-Security-Policy')
    expect(cspHeaders).to.have.property('X-WebKit-CSP')
  })

  it('should add all csp header to http response', function * () {
    const directives = {
      'default-src': ['self', 'js.example.com']
    }
    const request = http.createServer(function (req, res) {
      const cspHeaders = Csp.add(req, res, {directives})
      res.writeHead(200, {'content-type': 'text/html'})
      res.end()
    })
    const response = yield supertest(request).get('/')
    expect(response.headers).to.have.property('content-security-policy')
    expect(response.headers).to.have.property('x-content-security-policy')
    expect(response.headers).to.have.property('x-webkit-csp')
  })

  it('should add chrome only csp header to http response when user agent is set', function * () {
    const directives = {
      'default-src': ['self', 'js.example.com']
    }
    const request = http.createServer(function (req, res) {
      const cspHeaders = Csp.add(req, res, {directives})
      res.writeHead(200, {'content-type': 'text/html'})
      res.end()
    })
    const response = yield supertest(request).get('/').set('user-agent', latestChrome)
    expect(response.headers).to.have.property('content-security-policy')
    expect(response.headers).not.have.property('x-content-security-policy')
    expect(response.headers).not.have.property('x-webkit-csp')
  })
})
