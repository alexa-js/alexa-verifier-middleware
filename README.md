[![NPM Stats](https://nodei.co/npm/alexa-verifier-middleware.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/alexa-verifier-middleware/)

![NPM](https://img.shields.io/npm/dt/alexa-verifier-middleware.svg)
![DavidDM](https://david-dm.org/tejashah88/alexa-verifier-middleware.svg)
![NPM Version](https://img.shields.io/npm/v/alexa-verifier-middleware.svg)

# alexa-verifier-middleware
A simple middleware wrapper for [express](https://www.npmjs.com/package/express) via the [alexa-verifier](https://www.npmjs.com/package/alexa-verifier) node module.

# Why
The [alexa-verifier](https://www.npmjs.com/package/alexa-verifier) module did exist, but there was still quite a bit of code to write in order to make it work. Click [here](https://www.npmjs.com/package/alexa-verifier#express-example-usage) to see why.

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
app.use(avm());
```

# API Reference
### avm()
The main part of this module in which you use as middleware for express.