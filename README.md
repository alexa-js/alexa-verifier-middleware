[![NPM Stats](https://nodei.co/npm/alexa-verifier-middleware.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/alexa-verifier-middleware/)

![NPM](https://img.shields.io/npm/dt/alexa-verifier-middleware.svg)
![DavidDM](https://david-dm.org/tejashah88/alexa-verifier-middleware.svg)
![NPM Version](https://img.shields.io/npm/v/alexa-verifier-middleware.svg)

# alexa-verifier-middleware
A simple middleware wrapper for [express](https://www.npmjs.com/package/express) via the [alexa-verifier](https://www.npmjs.com/package/alexa-verifier) node module.

# Why
1. The [alexa-verifier](https://www.npmjs.com/package/alexa-verifier) module did exist, but there was still quite a bit of code to write in order to make it work. Click [here](https://www.npmjs.com/package/alexa-verifier#express-example-usage) to see why.
2. I've recently been having problems with Heroku's SSL certificates, mainly a false alarm concerning a time expiry problem.I kept on getting this error: `error validating the alexa cert: certificate expiration check failed`. However, when I tried verifying the expiry date for the certificate online on SSL Shopper (example is [here](echo-parrot.herokuapp.com/echo)), the certificate was perfectly fine. I developed this module mainly to give an option to bypass the time expiry check temporarily, until it's fixed. If you happen to be using Heroku and have been receiving this error like how I did, then this module is for you.

# Installation

```
npm install alexa-verifier-middleware --save
```

# Mentions
* [mreinstein](https://github.com/mreinstein) for his [alexa-verifier](https://github.com/mreinstein/alexa-verifier) module, which allows you to verify any Amazon requests from any web service

# Code Example

```javascript
var avm = require('alexa-verifier-middleware');
...
var app = express();
app.use(avm(false));
```

# API Reference
### avm(boolean overideTimeExpireCheck)
The main part of this module in which you use as middleware for express. The `overideTimeExpireCheck` is to bypass this error: `error validating the alexa cert: certificate expiration check failed` temporarily.