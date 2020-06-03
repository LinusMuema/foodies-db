const jwt = require('jsonwebtoken')
const userModel = require('./models/user')

exports.verify = (req, res, next) => {
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

exports.checkRecipeUpdate = (req, res, next) => {
    userModel.User.findById(req._id)
        .then(user => {
            let date = user.update[0].split(",")[0]
            let calls = user.update[0].split(",")[1]
            if (parseInt(date) === new Date().getDate() && parseInt(calls) >= 1 )
                return res.status(403).json({message: "error", reason: "daily limit reached"})
            user.update[0] = `${new Date().getDate()},${parseInt(calls) + 1}`
            user.markModified('update')
            user.save().then(result => {next()}).catch(error => {utils.handleServerError(res, error)})
        })
        .catch(error => {utils.handleServerError(res, error)})
}
