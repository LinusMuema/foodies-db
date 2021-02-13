const jwt = require('jsonwebtoken')
const User = require('./models/user')

exports.verify = async (req, res, next) => {
    try {
        const bearer = req.headers.authorization
        if (!bearer) return Error('please provide an bearer token')

        const token = bearer.split(" ")[1]
        const decode = await jwt.verify(token, process.env.TOKEN_SECRET)

        req.email = decode.split(',')[1]
        req.user = await User.findOne({email: req.email})

        next()
    } catch (e){ res.status(403).json({message: e.message}) }
}

exports.checkLimit = async (req, res, next) => {
    try {
        const today = new Date().getDate()
        if (req.user.lastUpdate === today) return Error('daily limit reached')
        next()
    } catch (e) {
        res.status(403).json({message: e.message})
    }
}

