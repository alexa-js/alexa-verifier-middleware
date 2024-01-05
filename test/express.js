import bodyParser from 'body-parser'
import express    from 'express'
import request    from 'supertest'
import { test }   from 'tap'
import verifier   from '../index.js'


test('with express.js and body-parser incorrectly mounted', function (t) {
  const app = express()
  app.use(bodyParser.json())
  app.use(verifier)
  const server = app.listen(3000)
  
  request(server)
    .post('/')
    .send({ x: 1 })
    .set('signaturecertchainurl', 'dummy')
    .set('signature-256', 'aGVsbG8NCg==')
    .end(function (err, res) {
      t.equal(res.statusCode, 400)
      t.same(res.body, {
        'reason': 'The raw request body has already been parsed.',
        'status': 'failure'
      })
      server.close()
      t.end()
    })
})
