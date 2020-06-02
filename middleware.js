const jwt = require('jsonwebtoken')
const userModel = require('./models/user')

exports.verify = (req, res, next) => {
    console.log("verify")
    const token = req.headers.authorization
    if (!token) return res.status(403).json({message: 'error', reason: 'please provide an bearer token'})
    jwt.verify(token.split(" ")[1], process.env.TOKEN_SECRET, (err, value) => {
        if (err) return res.status(500).json({message: 'error', reason: 'Failed to authenticate token.' })
        userModel.User.findById(value.user._id)
            .then(user => {
                if (!user) return utils.handleNoUserError(res)
                req._id = user._id
                next()
            })
            .catch(error => {utils.handleServerError(res, error)})
    })
}

exports.checkUpdate = (req, res, next) => {
    console.log("checkupdate")
    userModel.User.findById(req._id)
        .then(user => {
            console.log(user.update)
            if (user.update === new Date().getDate()){
                return res.status(403).json({message: "error", reason: "daily limit reached"})
            }
            next()
        })
        .catch(error => {utils.handleServerError(res, error)})
}
