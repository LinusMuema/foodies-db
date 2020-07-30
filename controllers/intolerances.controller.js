const userModel = require('../models/user');
const model = require('../models/intolerance');
const responseHandler = require('../utils/responseHandler')

exports.getAllIntolerances = (req, res) => {
    model.Intolerance.find()
        .then(intolerances => {
            if (!intolerances) return responseHandler.handleServerError(res, null)
            res.status(200).json({message: 'success', intolerances})
        })
        .catch(_ => {responseHandler.handleServerError(res, "error getting intolerances")})
}

exports.updateIntolerances = (req, res) => {
     userModel.User.findByIdAndUpdate(req._id, {intolerances: req.body.intolerances})
        .then(_ => {res.status(200).json({message: 'success', updated: true})})
        .catch(_ => {responseHandler.handleServerError(res, "error updating intolerances")})
}
