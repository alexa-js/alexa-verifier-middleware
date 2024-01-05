import url              from 'url'
import crypto           from 'crypto'
import { EventEmitter } from 'events';
import { test }         from 'tap'
import sinon            from 'sinon'
import nock             from 'nock'
import httpMocks        from 'node-mocks-http'
import forge            from 'node-forge'
import verifier         from '../index.js'


const MOCKED_TIMESTAMP = '2017-02-10T07:27:59Z'
const VALID_CERT_SAN = 'echo-api.amazon.com'
const VALID_CERT_URL = 'https://s3.amazonaws.com/echo.api/echo-api-cert-12.pem' // latest cert url
const VALID_CERT_URL_PATH = url.parse(VALID_CERT_URL).path

// Generate a certificate and a public/private key pair
function generateCertKeyPair() {
  var prng = forge.random.createInstance();
  prng.seedFileSync = function(needed) {
    return forge.util.fillString('a', needed);
  };

  const keys = forge.pki.rsa.generateKeyPair({
    bits: 512,
    workers: 1,
    prng: prng,
    algorithm: 'PRIMEINC',
  })

  const cert = forge.pki.createCertificate()
  cert.publicKey = keys.publicKey
  cert.serialNumber = '01'

  cert.validity.notBefore = '0000-01-01T01:01:01Z'
  cert.validity.notAfter = '9999-12-31T23:59:59Z'

  const attrs = [
    {
      name: 'commonName',
      value: 'example.org'
    },
    {
      name: 'countryName',
      value: 'US'
    },
    {
      shortName: 'ST',
      value: 'Virginia'
    },
    {
      name: 'localityName',
      value: 'Blacksburg'
    },
    {
      name: 'organizationName',
      value: 'Test'
    },
    {
      shortName: 'OU',
      value: 'Test'
    }
  ]

  cert.setSubject(attrs)
  cert.setIssuer(attrs)

  cert.setExtensions([
    {
      name: 'basicConstraints',
      cA: true
    },
    {
      name: 'keyUsage',
      keyCertSign: true,
      digitalSignature: true,
      nonRepudiation: true,
      keyEncipherment: true,
      dataEncipherment: true
    },
    {
      name: 'extKeyUsage',
      serverAuth: true,
      clientAuth: true,
      codeSigning: true,
      emailProtection: true,
      timeStamping: true
    },
    {
      name: 'nsCertType',
      client: true,
      server: true,
      email: true,
      objsign: true,
      sslCA: true,
      emailCA: true,
      objCA: true
    },
    {
      name: 'subjectAltName',
      altNames: [{
        type: 6, // URI
        value: VALID_CERT_SAN
      },
      {
        type: 7, // IP
        ip: '127.0.0.1'
      }]
    },
    {
      name: 'subjectKeyIdentifier'
    }
  ])

  // self-sign certificate
  cert.sign(keys.privateKey)

  return {
    certificate: forge.pki.certificateToPem(cert),
    publicKey:   forge.pki.publicKeyToPem(keys.publicKey),
    privateKey:  forge.pki.privateKeyToPem(keys.privateKey),
  }
}

// invoke the middleware by creating a mock request
function invokeMiddleware (data, next, after) {
  const callbacks = { }

  data['method'] = data['method'] || 'POST'
  data['on'] = function (eventName, callback) {
    callbacks[eventName] = callback
  }

  const mockReq = httpMocks.createRequest(data)
  const mockRes = httpMocks.createResponse()

  next = next || function () {}

  // verifier is an express middleware (i.e., function (req, res, next) { ... )
  verifier(mockReq, mockRes, next)

  if (callbacks['data']) {
    callbacks['data'](data['body'])
  }

  if (callbacks['end']) {
    callbacks['end']()
  }

  process.nextTick(after, mockRes)
}

test('enforce strict headerCheck always', function (t) {
  let calledNext = false
  const mockNext = function () { calledNext = true }

  const mockRes = invokeMiddleware({}, mockNext, function (mockRes) {
    t.equal(calledNext, false)
    t.equal(mockRes.statusCode, 400)
    t.same(mockRes._getJSONData(), {
      reason: 'missing certificate url',
      status: 'failure'
    })
    t.end()
  })
})

test('fail if request body is already parsed', function (t) {
  let calledNext = false
  const mockNext = function () { calledNext = true }

  const mockRes = invokeMiddleware({
    headers: {},
    _body: true,
    rawBody: {}
  }, mockNext, function (mockRes) {
    t.equal(calledNext, false)
    t.equal(mockRes.statusCode, 400)
    t.same(mockRes._getJSONData(), {
      reason: 'The raw request body has already been parsed.',
      status: 'failure'
    })
    t.end()
  })
})

test('fail invalid signaturecertchainurl header', function (t) {
  let calledNext = false
  const mockNext = function () { calledNext = true }

  const mockRes = invokeMiddleware({
    headers: {
      'signature-256': 'aGVsbG8NCg==',
      'signaturecertchainurl': 'https://invalid'
    },
    body: JSON.stringify({
      hello: 'world',
      request: {
        timestamp: new Date().getTime()
      }
    }),
  }, mockNext, function (mockRes) {
    t.equal(calledNext, false)
    t.equal(mockRes.statusCode, 400)
    t.same(mockRes._getJSONData(), {
      reason: 'Certificate URI hostname must be s3.amazonaws.com: invalid',
      status: 'failure'
    })

    t.end()
  })
})

test('fail invalid JSON body', function (t) {
  let calledNext = false
  const mockNext = function () { calledNext = true }

  const mockRes = invokeMiddleware({
    headers: {
      'signature-256': 'aGVsbG8NCg==',
      'signaturecertchainurl': 'https://invalid'
    },
    body: 'invalid'
  }, mockNext, function (mockRes) {
    t.equal(calledNext, false)
    t.equal(mockRes.statusCode, 400)
    t.same(mockRes._getJSONData(), {
      reason: 'request body invalid json',
      status: 'failure'
    })

    t.end()
  })
})

test('fail invalid signature', function (t) {
  // Mount fake timers
  const timeout = global.setTimeout // see https://github.com/sinonjs/sinon/issues/269
  const now = new Date(MOCKED_TIMESTAMP)
  const clock = sinon.useFakeTimers(now.getTime())

  // Generate a certificate but will not validate anything against it
  const { certificate } = generateCertKeyPair()

  // Mock fetching of certificate for this session only
  nock('https://s3.amazonaws.com').get(VALID_CERT_URL_PATH).reply(200, certificate)

  let calledNext = false
  const mockNext = function () { calledNext = true }

  const mockRes = invokeMiddleware({
    headers: {
      'signature-256': 'aGVsbG8NCg==',
      'signaturecertchainurl': VALID_CERT_URL
    },
    body: JSON.stringify({
      request: {
        timestamp: MOCKED_TIMESTAMP
      }
    })
  }, mockNext, function (mockRes) {
    // we need a timeout function here since the request might not be fully resolved until some point later
    // this should be revisited at some point...
    timeout(function () {
      t.equal(calledNext, false)
      t.equal(mockRes.statusCode, 400)
      t.same(mockRes._getJSONData(), {
        reason: 'invalid signature',
        status: 'failure'
      })

      clock.restore()
      t.end()
    }, 1000)
  })
})

test('pass with correct signature', function (t) {
  // Mount fake timers
  const timeout = global.setTimeout // see https://github.com/sinonjs/sinon/issues/269
  const now = new Date(MOCKED_TIMESTAMP)
  const clock = sinon.useFakeTimers(now.getTime())

  // Generate a certificate and private/public key pair
  const { certificate, privateKey } = generateCertKeyPair()

  // Mock fetching of certificate for this session only
  nock('https://s3.amazonaws.com').get(VALID_CERT_URL_PATH).reply(200, certificate)

  let calledNext = false
  const mockNext = function () { calledNext = true }

  const reqBody = JSON.stringify({
    "version": "1.0",
    "session": {
      "new": true,
      "sessionId": "SessionId.7745e45d-3042-45eb-8e86-cab2cf285daf",
      "application": {
        "applicationId": "amzn1.ask.skill.75c997b8-610f-4eb4-bf2e-95810e15fba2"
      },
      "attributes": {},
      "user": {
        "userId": "amzn1.ask.account.AF6Z7574YHBQCNNTJK45QROUSCUJEHIYAHZRP35FVU673VDGDKV4PH2M52PX4XWGCSYDM66B6SKEEFJN6RYWN7EME3FKASDIG7DPNGFFFNTN4ZT6B64IIZKSNTXQXEMVBXMA7J3FN3ERT2A4EDYFUYMGM4NSQU4RTAQOZWDD2J7JH6P2ROP2A6QEGLNLZDXNZU2DL7BKGCVLMNA"
      }
    },
    "request": {
      "type": "IntentRequest",
      "requestId": "EdwRequestId.fa7428b7-75d0-44c8-aebb-4c222ed48ebe",
      "timestamp": MOCKED_TIMESTAMP,
      "locale": "en-US",
      "intent": {
        "name": "HelloWorld"
      },
      "inDialog": false
    }
  })

  // Create a base64-encoded signature to validate the request against via the public certificate
  const signer = crypto.createSign('RSA-SHA256')
  signer.update(reqBody)
  const signature = signer.sign(privateKey, 'base64')

  const mockRes = invokeMiddleware({
    headers: {
      'signature-256': signature,
      'signaturecertchainurl': VALID_CERT_URL
    },
    body: reqBody
  }, mockNext, function (mockRes) {
    // we need a timeout function here since the request might not be fully resolved until some point later
    // this should be revisited at some point...
    timeout(function () {
      t.equal(calledNext, true)
      t.equal(mockRes.statusCode, 200)

      clock.restore()
      t.end()
    }, 1000)
  })
})
