var verifier = require('alexa-verifier')


// the alexa API calls specify an HTTPS certificate that must be validated.
// the validation uses the request's raw POST body which isn't available from
// the body parser module. so we look for any requests that include a
// signaturecertchainurl HTTP request header, parse out the entire body as a
// text string, and set a flag on the request object so other body parser
// middlewares don't try to parse the body again
module.exports = function avmContainer(options) {
	return function alexaVerifierMiddleware(req, res, next) {
		var strictHeaderCheck = (typeof options !== 'undefined' && typeof options.strictHeaderCheck !== 'undefined' && options.strictHeaderCheck === true)

		if (!req.headers.signaturecertchainurl) {
			// by default, strict header checking isn't enforced
			if (strictHeaderCheck) {
				// respond with a 401 error
				return res.status(401).json({ status: 'failure', reason: 'The signaturecertchainurl HTTP request header is invalid!' })
			} else {
				// ignore the check
				return next()
			}
		}

		if (!req.headers.signature) {
			// by default, strict header checking isn't enforced
			if (strictHeaderCheck) {
				// respond with a 401 error
				return res.status(401).json({ status: 'failure', reason: 'The signature HTTP request header is invalid!' })
			} else {
				// ignore the check
				return next()
			}
		}

		// mark the request body as already having been parsed so it's ignored by
		// other body parser middlewares
		req._body = true
		req.rawBody = ''
		req.on('data', function(data) {
			return req.rawBody += data
		})

		req.on('end', function() {
			var cert_url, er, error, requestBody, signature

			try {
				req.body = JSON.parse(req.rawBody)
			} catch (error) {
				er = error
				req.body = {}
			}

			cert_url = req.headers.signaturecertchainurl
			signature = req.headers.signature
			requestBody = req.rawBody

			verifier(cert_url, signature, requestBody, function(er) {
				if (er) {
					res.status(401).json({ status: 'failure', reason: er })
				} else {
					next()
				}
			})
		})
	}
}
