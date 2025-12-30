import {rateLimit} from 'express-rate-limit'

const limitter = rateLimit({
    windowMs: 1000 * 60 * 1, // 1 minute
    // max: 10, // Limit each IP to 10 requests per `window` (here, per 1 minute)
    limit: 50, // Limit each IP to 10 requests per `window` (here, per 1 minute)
    standardHeaders: 'draft-8', // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        statusCode: 429,
        message: 'Too many requests, please try again later.',
        error: 'Too many requests, please try again later.'
    },
    handler: (req, res, next, options) => {
        res.status(options.statusCode).send(options.message)
    }
})

export default limitter