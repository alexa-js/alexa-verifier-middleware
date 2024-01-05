# alexa-verifier-middleware

![NPM Version](https://img.shields.io/npm/v/alexa-verifier-middleware.svg)

![Github CI status](https://github.com/alexa-js/alexa-verifier-middleware/actions/workflows/main.yml/badge.svg)

An [express](https://www.npmjs.com/package/express) middleware that verifies HTTP requests sent to an Alexa skill are sent from Amazon.


Version 3.x is now a pure ES module, and requires node 12.17 or higher. If you want to run this via an older version of node, use
[alexa-verifier-middleware@1.x](https://www.npmjs.com/package/alexa-verifier-middleware/v/1.0.3) 


### Usage

It is recommended that you attach all Alexa routes to an express Router.
```javascript
import express  from 'express';
import verifier from 'alexa-verifier-middleware';


const app = express();

// create a router and attach to express before doing anything else
const alexaRouter = express.Router();
app.use('/alexa', alexaRouter);

// attach the verifier middleware first because it needs the entire
// request body, and express doesn't expose this on the request object
alexaRouter.use(verifier);

// Routes that handle alexa traffic are now attached here.
// Since this is attached to a router mounted at /alexa,
// this endpoint will be accessible at /alexa/weather_info
alexaRouter.get('/weather_info', function (req, res) { ... });

app.listen(3000);
```

### Common errors

#### The raw request body has already been parsed.
* This means that you're probably using one of the body-parser middlewares and it is loaded before this one. To fix it, you should load the body-parsers **after** this one.

Before:
```javascript
const alexaRouter = express.Router();
app.use('/alexa', alexaRouter);

// INCORRECT
alexaRouter.use(bodyParser.json());
alexaRouter.use(verifier);
```

After:
```javascript
const alexaRouter = express.Router();
app.use('/alexa', alexaRouter);

// CORRECT
alexaRouter.use(verifier);
alexaRouter.use(bodyParser.json());
```

### Mentions
* [mreinstein](https://github.com/mreinstein) for his [alexa-verifier](https://github.com/mreinstein/alexa-verifier) module, which allows you to verify any Amazon requests from any web service
