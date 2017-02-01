'use strict'

var test     = require('tap').test
var verifier = require('../')


// verifier() returns a function of the form function(req, res, next)
// (a standard expressjs middleware)

test('enforce strict headerCheck always', function(t) {

  var mockReq = { headers: {}, on: function(eventName, callback) { } }
  var mockRes = { }
  var nextInvocationCount = 0
  var mockNext = function() { nextInvocationCount++ }

  verifier(mockReq, mockRes, mockNext)

  t.equal(nextInvocationCount, 0)
  t.end()
})


test('fail missing signaturecertchainurl header', function(t) {
  var mockReq = {
    headers: {},
    on: function(eventName, callback) { }
  }

  var mockRes = {
    status: function(httpCode) {
      t.equal(httpCode, 401)
      return {
        json: function(input) {
          t.deepEqual(input, { status: 'failure', reason: 'The signaturecertchainurl HTTP request header is invalid!' })
        }
      }
    }
  }

  var nextInvocationCount = 0
  var mockNext = function() { nextInvocationCount++ }

  verifier(mockReq, mockRes, mockNext)

  t.equal(nextInvocationCount, 0)
  t.end()
})


test('fail missing signature header', function(t) {
  var mockReq = {
    headers: {
      signaturecertchainurl: 'some-bogus-value'
    },
    on: function(eventName, callback) { }
  }

  var mockRes = {
    status: function(httpCode) {
      t.equal(httpCode, 401)
      return {
        json: function(input) {
          t.deepEqual(input, { status: 'failure', reason: 'The signature HTTP request header is invalid!' })
        }
      }
    }
  }

  var nextInvocationCount = 0
  var mockNext = function() { nextInvocationCount++ }

  verifier(mockReq, mockRes, mockNext)

  t.equal(nextInvocationCount, 0)
  t.end()
})


test('pass', function(t) {
  
  var mockReq = {
    headers: {
      signaturecertchainurl: 'some-bogus-value',
      signature: 'another-dud-value'
    },
    on: function(eventName, callback) { }
  }

  var mockRes = { }

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

  var mockReq = {
    headers: {
      signaturecertchainurl: 'some-bogus-value',
      signature: 'heres-another-arbitrary-value'
    },
    on: function(eventName, callback) {
      if (eventName === 'data') dataCallback = callback
      if (eventName === 'end') endCallback = callback
    }
  }

  var mockRes = {
    status: function(httpCode) {
      return {
        json: function(input) {
        }
      }
    }
  }

  var mockNext = function() { }

  verifier(mockReq, mockRes, mockNext)

  // use setTimeout to force asnychronous callback
  setTimeout(function() {
    dataCallback('some invalid JSON string')
    endCallback()
    t.equal(mockReq._body, true)
    t.equal(mockReq.rawBody, 'some invalid JSON string')
    t.deepEqual(mockReq.body, {})
    t.end()
  }, 0)
})
