import {Request, Response, NextFunction} from "express"
/**
 * This function lookup for requests that include a signaturecertchainurl HTTP in header, parse out the entire body as a text string, and set a flag on the request object so others don't try to parse the body again. 
 * {@link https://github.com/alexa-js/alexa-verifier-middleware See the Documentation}
 */
declare function alexaVerifierMiddleware (req: Request, res: Response, next: NextFunction): NextFunction

export = alexaVerifierMiddleware
