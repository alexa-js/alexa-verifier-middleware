var verifier = require('alexa-verifier')

// the alexa API calls specify an HTTPS certificate that must be validated.
// the validation uses the request's raw POST body which isn't available from
// the body parser module. so we look for any requests that include a
// signaturecertchainurl HTTP request header, parse out the entire body as a
// text string, and set a flag on the request object so other body parser
// middlewares don't try to parse the body again
module.exports = function alexaVerifierMiddleware(req, res, next) {
  if (req._body) {
    var er = 'The raw request body has already been parsed.'
    return res.status(400).json({ status: 'failure', reason: er })
  }

  // TODO: if _rawBody is set and a string, don't obliterate it here!

  // mark the request body as already having been parsed so it's ignored by
  // other body parser middlewares
  req._body = true
  req.rawBody = ''
  req.on('data', function(data) {
    return req.rawBody += data
  })

  req.on('end', function() {
    var certUrl, er, error, signature

    try {
      req.body = JSON.parse(req.rawBody)
    } catch (error) {
      er = error
      req.body = {}
    }

    certUrl = req.headers.signaturecertchainurl
    signature = req.headers.signature

    verifier(certUrl, signature, req.rawBody, function(er) {
      if (er) {
        res.status(401).json({ status: 'failure', reason: er })
      } else {
        next()
      }
    })
  })
}
