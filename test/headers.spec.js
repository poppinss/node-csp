'use strict'

/**
 * node-csp
 * Copyright(c) 2016-2016 Harminder Virk
 * MIT Licensed
*/

const chai = require('chai')
const expect = chai.expect
const CspHeaders = require('../src/Csp/headers')

describe('Csp Headers', function() {

  it('should return csp header when browser is set to IE and version is greater than 12', function () {
    const headers = CspHeaders.IE({version: '13'})
    expect(headers).deep.equal(['Content-Security-Policy'])
  })

  it('should return csp header when browser is set to IE and version is less than 12', function () {
    const headers = CspHeaders.IE({version: '11'})
    expect(headers).deep.equal(['X-Content-Security-Policy'])
  })

  it('should return empty array when browser is set to IE and version is less than 10', function () {
    const headers = CspHeaders.IE({version: '9'})
    expect(headers).deep.equal([])
  })

  it('should return csp header when browser is set to Chrome and version equals 45', function () {
    const headers = CspHeaders.Chrome({version: '45'})
    expect(headers).deep.equal(['Content-Security-Policy'])
  })

  it('should return csp header when browser is set to Chrome and version less than 25', function () {
    const headers = CspHeaders.Chrome({version: '24'})
    expect(headers).deep.equal(['X-WebKit-CSP'])
  })

  it('should return empty array when is set to Chrome and version less than 14', function () {
    const headers = CspHeaders.Chrome({version: '13'})
    expect(headers).deep.equal([])
  })

  it('should return csp headers when browser is set to Safari and version greater than equals to 9', function () {
    const headers = CspHeaders.Safari({version: '9'})
    expect(headers).deep.equal(['Content-Security-Policy'])
  })

  it('should return csp headers when browser is set to Safari and version equals to 6', function () {
    const headers = CspHeaders.Safari({version: '6'})
    expect(headers).deep.equal(['X-WebKit-CSP'])
  })

  it('should return empty array when browser is set to Safari and version less than 6', function () {
    const headers = CspHeaders.Safari({version: '5'})
    expect(headers).deep.equal([])
  })

  it('should return csp header when browser is set to Opera and version is greater than equals to 34', function () {
    const headers = CspHeaders.Opera({version: '34'})
    expect(headers).deep.equal(['Content-Security-Policy'])
  })

  it('should return empty array when browser is set to Opera and version is less than 15', function () {
    const headers = CspHeaders.Opera({version: '14'})
    expect(headers).deep.equal([])
  })

  it('should return csp header when browser is set to Android browser and version is greater than equals to 4.4', function () {
    const headers = CspHeaders['Android Browser']({os: {version: '4.4'}}, {})
    expect(headers).deep.equal(['Content-Security-Policy'])
  })

  it('should return empty array when browser is set to Android browser and version is less than 4.4', function () {
    const headers = CspHeaders['Android Browser']({os: {version: '4.3'}}, {})
    expect(headers).deep.equal([])
  })

  it('should return empty array when browser is set to Android browser and version greater than 4.4 but android is disabled under options', function () {
    const headers = CspHeaders['Android Browser']({os: {version: '4.5'}}, {disableAndroid: true})
    expect(headers).deep.equal([])
  })

  it('should return csp header when browser is set to Chrome Mobile and os is Ios', function () {
    const headers = CspHeaders['Chrome Mobile']({os: {version: '3.2', family: 'iOS'}}, {})
    expect(headers).deep.equal(['Content-Security-Policy'])
  })

  it('should return fallback to Android mobile when os is not iOS', function () {
    const headers = CspHeaders['Chrome Mobile']({os: {version: '3.2', family: 'Android'}}, {})
    expect(headers).deep.equal([])
  })

  it('should return csp header when browser is set to Firefox and version is greater than equals to 23', function () {
    const headers = CspHeaders.Firefox({version: '23'})
    expect(headers).deep.equal(['Content-Security-Policy'])
  })

  it('should return csp header when browser is set to Firefox and version is less than 23', function () {
    const headers = CspHeaders.Firefox({version: '22'})
    expect(headers).deep.equal(['X-Content-Security-Policy'])
  })

  it('should return empty array when browser is set to Firefox and version is less than 4', function () {
    const headers = CspHeaders.Firefox({version: '3'})
    expect(headers).deep.equal([])
  })

  it('should return empty all csp headers supported by all browsers so far', function () {
    const headers = CspHeaders.getAllHeaders()
    expect(headers).deep.equal(['Content-Security-Policy', 'X-Content-Security-Policy', 'X-WebKit-CSP'])
  })
})