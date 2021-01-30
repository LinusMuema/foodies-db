const validator = require('deep-email-validator');
const utils = require("../utils/utils");
const User = require("../models/user");

async function registerUser(email) {
    const validation = await validator.validate(email)
    if (!validation.valid) throw Error('Email is not valid')
    new User({email: email}).save()
    return utils.generateAccessToken(email)
}

exports.register = async (req, res) => {
    const email = req.body.email
    let token = {}
    try {
        const user = await User.findOne({email: email})
        if (user) token = await utils.generateAccessToken(email)
        else token = await registerUser(email)
        res.status(200).json({token})
    } catch (err){
        res.status(500).json({message: err.message})
    }
}
