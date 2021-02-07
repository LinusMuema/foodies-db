const jwt = require('jsonwebtoken')
const User = require('./models/user')

exports.verify = async (req, res, next) => {
    try {
        const bearer = req.headers.authorization
        if (!bearer) throw Error('please provide an bearer token')

        const token = bearer.split(" ")[1]
        const secret = process.env.TOKEN_SECRET
        const decode = jwt.verify(token, secret)
        req.email = decode.split(',')[1]
        req.user = await User.findOne({email: req.email})
        next()
    } catch (e){
        res.status(403).json({message: e.message})
    }
}

exports.checkLimit = async (req, res, next) => {
    try {
        const today = new Date().getDate()
        if (req.user.lastUpdate === today) throw Error('daily limit reached')
        next()
    } catch (e) {
        res.status(403).json({message: e.message})
    }
}

