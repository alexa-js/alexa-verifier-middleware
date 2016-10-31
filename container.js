var verifier = require('alexa-verifier');

// used to verify that the incoming requests requests are comming from Amazon only
var avm = function(overrideTimeExpireCheck) {
	return function(req, res, next) {
		if (!req.headers.signaturecertchainurl) {
			return next();
		}

		// mark the request body as already having been parsed so it's ignored by other body parser middlewares
		req._body = true;
		req.rawBody = '';
		req.on('data', function(data) {
			return req.rawBody += data;
		});
		req.on('end', function() {
			var cert_url, er, error, requestBody, signature;
			try {
				req.body = JSON.parse(req.rawBody);
			} catch (error) {
				er = error;
				req.body = {};
			}
			cert_url = req.headers.signaturecertchainurl;
			signature = req.headers.signature;
			requestBody = req.rawBody;
			verifier(cert_url, signature, requestBody, overrideTimeExpireCheck, function(er) {
				if (er) {
					console.error('error validating the alexa cert:', er);
					res.status(401).json({
						status: 'failure',
						reason: er
					});
				} else {
					next();
				}
			});
		});
	};
}

module.exports = avm;