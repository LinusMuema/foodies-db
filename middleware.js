const jwt = require('jsonwebtoken')
const User = require('./models/user')

exports.verify = async (req, res, next) => {
    const bearer = req.headers.authorization
    if (!bearer) return res.status(403).json({message: 'please provide an bearer token'})

    const token = bearer.split(" ")[1]
    const secret = process.env.TOKEN_SECRET

    try {
        const decode = jwt.verify(token, secret)
        req.email = decode.split(',')[1]
        req.user = await User.findOne({email: req.email})
        next()
    } catch (err){
        res.status(500).json({message: err.message})
    }
}

