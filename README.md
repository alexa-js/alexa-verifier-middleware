[![NPM](https://nodei.co/npm/alexa-verifier-middleware.png)](https://www.npmjs.com/package/alexa-verifier-middleware/)

[![dependencies Status](https://david-dm.org/tejashah88/alexa-verifier-middleware/status.svg)](https://david-dm.org/tejashah88/alexa-verifier-middleware)
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

# Note about other middleware usage!
Before you read the code example, there should be one thing to note. If you are using any other middleware, you should load this one before any others. Otherwise, this middleware will not be able to read the request.

Let's say you are making an Alexa skill with [express](https://www.npmjs.com/package/express) and you need to use the [body-parser](https://www.npmjs.com/package/body-parser) middleware module. Make sure that this middleware **loads first**
```javascript
var express = require('express');
var bodyParser = require('body-parser');
var avm = require('alexa-verifier-middleware');
var app = express();

// note that the 'avm' middleware is loaded first
app.use(avm());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
```

If there is another middleware that says it needs to load first, and you are not sure which placement is better, let me know by opening an issue and I'll do some extensive testing before reporting which middleware to load first.

# Code Example

```javascript
var express = require('express');
var avm = require('alexa-verifier-middleware');
var app = express();

app.use(avm());
```

# API Reference
### avm()
The main part of this module in which you use as middleware for express.
