const jwt = require('jsonwebtoken')
const userModel = require('./models/user.js')
const response = require('./utils/response')

exports.verify = (req, res, next) => {
    const bearer = req.headers.authorization
    if (!bearer) return res.status(403).json({message: 'please provide an bearer token'})

    const token = bearer.split(" ")[1]
    const secret = process.env.TOKEN_SECRET

    jwt.verify(token, secret, (err, value) => {
        if (err) return response.serverError(res, 'failed to authenticate token')
        req.email = value.split(",")[1]
        next()
    })
}
