const User = require('../models/user');
const utils = require('../utils/utils');
const Intolerance = require('../models/intolerance');

exports.getAllIntolerances = (req, res) => {
    Intolerance.find()
        .then(intolerances => {
            if (!intolerances) return utils.handleServerError(res, null)
            res.status(200).json({message: 'success', intolerances})
        })
        .catch(error => {utils.handleServerError(res, error)})
}

exports.updateIntolerances = (req, res) => {
    User.findById(req._id)
        .then(user => {
            if (!user) return utils.handleNoUserError(res)
            User.findByIdAndUpdate(req._id, {intolerances: req.body.intolerances})
                .then(response => {res.status(200).json({message: 'success', updated: true})})
                .catch(error => {utils.handleServerError(res, error)})
        })
        .catch(error => {utils.handleServerError(res, error)})
}
