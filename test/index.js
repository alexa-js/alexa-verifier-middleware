'use strict'

var test     = require('tap').test
var verifier = require('../')
var httpMocks = require('node-mocks-http')

// verifier is an express middleware (i.e., function(req, res, next) { ... )

test('enforce strict headerCheck always', function(t) {
  var mockReq = httpMocks.createRequest({
    method: 'POST',
    headers: { },
    on: function(eventName, callback) { }
  })

  var mockRes = httpMocks.createResponse({ })

  var nextInvocationCount = 0
  var mockNext = function() { nextInvocationCount++ }

  verifier(mockReq, mockRes, mockNext)

  t.equal(nextInvocationCount, 0)
  t.end()
})

test('fail if request body is already parsed', function(t) {
  var mockReq = httpMocks.createRequest({
    method: 'POST',
    headers: { },
    _body: true,
    _rawBody: {},
    on: function(eventName, callback) { }
  })

  var mockRes = httpMocks.createResponse({
    status: function(httpCode) {
      t.equal(httpCode, 400)
      return {
        json: function(input) {
          t.deepEqual(input, { status: 'failure', reason: 'The raw request body is not available.' })
        }
      }
    }
  })

  var nextInvocationCount = 0
  var mockNext = function() { nextInvocationCount++ }

  verifier(mockReq, mockRes, mockNext)

  t.equal(nextInvocationCount, 0)
  t.end()
})

test('fail missing signaturecertchainurl header', function(t) {
  var mockReq = httpMocks.createRequest({
    method: 'POST',
    headers: { },
    on: function(eventName, callback) { }
  })

  var mockRes = httpMocks.createResponse({
    status: function(httpCode) {
      t.equal(httpCode, 401)
      return {
        json: function(input) {
          t.deepEqual(input, { status: 'failure', reason: 'The signaturecertchainurl HTTP request header is invalid!' })
        }
      }
    }
  })

  var nextInvocationCount = 0
  var mockNext = function() { nextInvocationCount++ }

  verifier(mockReq, mockRes, mockNext)

  t.equal(nextInvocationCount, 0)
  t.end()
})

test('fail missing signature header', function(t) {
  var mockReq = httpMocks.createRequest({
    method: 'POST',
    headers: {
      signaturecertchainurl: 'some-bogus-value'
    },
    on: function(eventName, callback) { }
  })

  var mockRes = httpMocks.createResponse({
    status: function(httpCode) {
      t.equal(httpCode, 401)
      return {
        json: function(input) {
          t.deepEqual(input, { status: 'failure', reason: 'The signature HTTP request header is invalid!' })
        }
      }
    }
  })

  var nextInvocationCount = 0
  var mockNext = function() { nextInvocationCount++ }

  verifier(mockReq, mockRes, mockNext)

  t.equal(nextInvocationCount, 0)
  t.end()
})

test('pass', function(t) {
  var mockReq = httpMocks.createRequest({
    method: 'POST',
    headers: {
      signaturecertchainurl: 'some-bogus-value',
      signature: 'another-dud-value'
    },
    on: function(eventName, callback) { }
  })

  // this should happen since we aren't supplying the actual AMAZON headers
  var mockRes = httpMocks.createResponse({
    status: function(httpCode) {
      t.equal(httpCode, 401)
      return {
        json: function(input) {
          t.deepEqual(input, { status: 'failure', reason: 'signature is not base64 encoded' })
        }
      }
    }
  })

  var nextInvocationCount = 0
  var mockNext = function() { nextInvocationCount++ }

  verifier(mockReq, mockRes, mockNext)

  t.equal(nextInvocationCount, 0)
  t.equal(mockReq._body, true)
  t.equal(mockReq.rawBody, '')
  t.end()
})

test('fail on invalid JSON body', function(t) {
  var dataCallback, endCallback

  var mockReq = httpMocks.createRequest({
    method: 'POST',
    headers: {
      signaturecertchainurl: 'some-bogus-value',
      signature: 'heres-another-arbitrary-value'
    },
    on: function(eventName, callback) {
      if (eventName === 'data') dataCallback = callback
      if (eventName === 'end') endCallback = callback
    }
  })

  var mockRes = httpMocks.createResponse({
    status: function(httpCode) {
      return {
        json: function(input) {
        }
      }
    }
  })

  var mockNext = function() { }

  verifier(mockReq, mockRes, mockNext)

  // use setTimeout to force asnychronous callback
  setTimeout(function() {
    dataCallback('some invalid JSON string')
    endCallback()
    t.equal(mockReq._body, true)
    t.equal(mockReq.rawBody, 'some invalid JSON string')
    t.deepEqual(mockReq.body, { })
    t.end()
  }, 0)
})
