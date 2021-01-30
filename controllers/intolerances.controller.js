const User = require('../models/user');
const Intolerance = require('../models/intolerance');

exports.getAllIntolerances = async (req, res) => {
    try {
        const data = await Intolerance.find()
        res.status(200).json(data)
    } catch (err){
        res.status(500).json({message: err.message})
    }
}

exports.updateIntolerances = async (req, res) => {
    try {
        const update = await User.findOneAndUpdate({email: req.email}, {intolerances: req.body.intolerances}, {new: true})
        res.status(200).json(update)
    } catch (err){
        res.status(500).json({message: err.message})
    }
}
