# Node Csp

Node Csp is a general purpose module to add `Content Security Policy` header to your http response. It can be used with any node http server.

## Features

1. Cross Browser support as per http://caniuse.com/#feat=contentsecuritypolicy
2. Supports all directives using http://content-security-policy.com/
3. Has support for `nonce`
4. Fully tested.

## Vanilla Http Server

```javascript
const http = require('http')
const csp = require('node-csp')
const fs = require('fs')

const options = {
  directives: {
    defaultSrc: ['self'],
    scriptSrc: ['self', 'cdnjs.cloudflare.com', '@nonce']
  },
  nonce: '614d9122-d5b0-4760-aecf-3a5d17cf0ac9' // make sure to have unique nonce for each request
}

http.createServer(function (req, res) {
  const html = fs.readFile(__dirname + '/index.html', function (err, contents) {
    csp.add(req, res, options)
    res.writeHead(200)
    res.write(contents)
    res.end()
  })
}).listen(4000)

```

## Options

```javascript
{
   directives: {
    defaultSrc: ['self'],
    scriptSrc: ['@nonce'],
    styleSrc: ['self', 'cdnjs.cloudflare.com'],
    ...
   },
   nonce: '614d9122-d5b0-4760-aecf-3a5d17cf0ac9',
   reportOnly: false, // only set reporty only headers
   setAllHeaders: false, // sets all csp headers as per http://content-security-policy.com/
   disableAndroid: false // csp is buggy on android
}
```