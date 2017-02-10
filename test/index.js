'use strict'

var test = require('tap').test
var verifier = require('../')
var httpMocks = require('node-mocks-http')

var invokeMiddleware = function(data, next) {
  var callbacks = {};

  data['method'] = data['method'] || 'POST';
  data['on'] = function(eventName, callback) {
    callbacks[eventName] = callback;
  };

  var mockReq = httpMocks.createRequest(data);
  var mockRes = httpMocks.createResponse();

  next = next || function() {}

  // verifier is an express middleware (i.e., function(req, res, next) { ... )
  verifier(mockReq, mockRes, next);

  if (callbacks['data']) {
    callbacks['data'](data['body']);
  }

  if (callbacks['end']) {
    callbacks['end']();
  }

  return mockRes;
};

test('enforce strict headerCheck always', function(t) {
  var nextInvocationCount = 0
  var mockNext = function() { nextInvocationCount++ }
  var mockRes = invokeMiddleware({}, mockNext);

  t.equal(mockRes.statusCode, 401);
  t.deepEqual(JSON.parse(mockRes._getData()), {
    reason: 'signature is not base64 encoded',
    status: 'failure'
  });
  t.equal(nextInvocationCount, 0)
  t.end()
});

test('fail if request body is already parsed', function(t) {
  var mockRes = invokeMiddleware({
    headers: {},
    _body: true,
    rawBody: {}
  });

  t.equal(mockRes.statusCode, 400);
  t.deepEqual(JSON.parse(mockRes._getData()), {
    reason: 'The raw request body has already been parsed.',
    status: 'failure'
  });

  t.end();
})

test('fail invalid signaturecertchainurl header', function(t) {
  var mockRes = invokeMiddleware({
    headers: {
      signature: 'aGVsbG8NCg==',
      signaturecertchainurl: 'https://invalid'
    },
    body: JSON.stringify({
      hello: 'world',
      request: {
        timestamp: new Date().getTime()
      }
    }),
  });

  t.equal(mockRes.statusCode, 401);
  t.deepEqual(JSON.parse(mockRes._getData()), {
    reason: 'Certificate URI hostname must be s3.amazonaws.com: invalid',
    status: 'failure'
  });

  t.end()
});

test('fail invalid JSON body', function(t) {
  var mockRes = invokeMiddleware({
    headers: {
      signature: 'aGVsbG8NCg==',
      signaturecertchainurl: 'https://invalid'
    },
    body: 'invalid'
  });

  t.equal(mockRes.statusCode, 401);
  t.deepEqual(JSON.parse(mockRes._getData()), {
    reason: 'request body invalid json',
    status: 'failure'
  });

  t.end()
});


test('fail invalid signature', function(t) {
  var mockRes = invokeMiddleware({
    headers: {
      signature: 'aGVsbG8NCg==',
      signaturecertchainurl: 'https://s3.amazonaws.com/echo.api/echo-api-cert.pem'
    },
    body: JSON.stringify({
      request: {
        timestamp: new Date().getTime()
      }
    })
  });

  setTimeout(function() {
    t.equal(mockRes.statusCode, 401);
    t.deepEqual(JSON.parse(mockRes._getData()), {
      reason: 'certificate expiration check failed',
      status: 'failure'
    });
    t.end();
  }, 2000);
});
