const jwt = require('jsonwebtoken');
const User = require('./models/user');
const response = require('./utils/response');

exports.verify = async (req, res, next) => {
    try {
        const bearer = req.headers.authorization
        if (!bearer)
            return response.forbiddenError(res,'please provide an bearer token')
        const token = bearer.split(" ")[1]
        const decode = await jwt.verify(token, process.env.TOKEN_SECRET)
        req.email = decode.split(',')[1]
        req.user = await User.findOne({email: req.email})
        next()
    } catch (e){ response.serverError(res, e.message) }
}

exports.checkLimit = async (req, res, next) => {
    try {
        const today = new Date().getDate()
        if (req.user.lastUpdate === today)
            return response.forbiddenError(res, 'daily limit reached')
        next()
    } catch (e){ response.serverError(res, e.message) }
}

