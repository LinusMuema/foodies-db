const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
    const token = req.headers.authorization
    if (!token) return res.status(403).json({message: 'error', reason: 'please provide an bearer token'})
    jwt.verify(token.split(" ")[1], process.env.TOKEN_SECRET, (err, value) => {
        if (err) return res.status(500).json({message: 'error', reason: 'Failed to authenticate token.' })
        req._id = value.user._id
        next()
    })
}

module.exports = {verify: authenticateToken}
