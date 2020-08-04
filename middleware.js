const jwt = require('jsonwebtoken')
const userModel = require('./models/user')
const responseHandler = require('./utils/responseHandler')

exports.verify = (req, res, next) => {
    const token = req.headers.authorization
    if (!token) return res.status(403).json({message: 'error', reason: 'please provide an bearer token'})
    jwt.verify(token.split(" ")[1], process.env.TOKEN_SECRET, (err, value) => {
        if (err) return responseHandler.handleServerError(res, 'failed to authenticate token')
        let user = Object.values(value)[0]
        req.premium = user.premium
        req._id = user._id
        next()
    })
}

exports.checkRecipeUpdate = (req, res, next) => {
    req.calls = req.premium === true ?  10 : 5
    userModel.User.findById(req._id)
        .then(user => {
            let date = user.update[0].split(",")[0]
            let calls = user.update[0].split(",")[1]
            if (parseInt(date) === new Date().getDate() && parseInt(calls) >= 1 )
                return res.status(403).json({message: "error", reason: "daily limit reached"})
            else
                next()
        })
        .catch(error => {responseHandler.handleServerError(res, error)})
}

exports.checkSearchesUpdate = (req, res, next) => {
    if (req.premium) next()
    userModel.User.findById(req._id)
        .then(user => {
            let date = user.update[1].split(",")[0]
            let calls = user.update[1].split(",")[1]
            if (parseInt(date) === new Date().getDate() && parseInt(calls) >= 10 )
                return res.status(403).json({message: "error", reason: "daily search limit reached"})
            else
                next()
        })
        .catch(error => {responseHandler.handleServerError(res, error)})
}
