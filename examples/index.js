'use strict'

/**
 * node-csp
 * Copyright(c) 2016-2016 Harminder Virk
 * MIT Licensed
*/

const http = require('http')
const Csp = require('../src/Csp')
const fs = require('fs')

const options = {
  directives: {
    'default-src': ['self'],
    'script-src': ['self', 'cdnjs.cloudflare.com', '@nonce']
  },
  nonce: '614d9122-d5b0-4760-aecf-3a5d17cf0ac9'
}

http.createServer(function (req, res) {
  const html = fs.readFile(__dirname + '/index.html', function (err, contents) {
    Csp.add(req, res, options)
    res.writeHead(200)
    res.write(contents)
    res.end()
  })
}).listen(4000)