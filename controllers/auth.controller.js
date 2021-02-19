const validator = require('deep-email-validator');
const utils = require('../utils/utils');
const templates = require('../views/templates')
const User = require('../models/user');

let type = 'login'

async function registerUser(email) {
    const validation = await validator.validate(email)
    if (!validation.valid) throw Error('Email is not valid')

    const token = utils.generateAccessToken(email)
    const user = User({email: email}).save()
    const smtp = utils.sendEmail(email, 'Welcome to Foodies', templates.welcome)
    await Promise.all([user, smtp, token])

    type = 'signup'
    return token
}

exports.register = async (req, res) => {
    const email = req.body.email
    let token = {}
    try {
        const user = await User.findOne({email: email})

        if (user) token = await utils.generateAccessToken(email)
        else token = await registerUser(email)

        res.status(200).json({token, type})
    } catch (err){
        res.status(500).json({message: err.message})
    }
}

exports.updateUser = async (req, res) => {
    try {
        req.user.lastUpdate = new Date().getDate()
        await req.user.save()
        res.status(202).json({message: 'success'})
    } catch (e) { res.status(500).json({message: e.message}) }
}
