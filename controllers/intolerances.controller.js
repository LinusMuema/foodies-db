const User = require('../models/user');
const Intolerance = require('../models/intolerance');
const response = require('../utils/response');

exports.getAllIntolerances = async (req, res) => {
    try {
        const data = await Intolerance.find()
        res.status(200).json(data)
    } catch (e){ response.serverError(res, e.message) }
}

exports.updateIntolerances = async (req, res) => {
    try {
        await User.findOneAndUpdate({email: req.email}, {intolerances: req.body.intolerances})
        res.status(200).json({status: 'success'})
    } catch (e){ response.serverError(res, e.message) }
}
