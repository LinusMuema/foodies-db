const validator = require('deep-email-validator');
const jwt = require('../utils/jwt');
const smtp = require('../utils/smtp')
const templates = require('../views/templates')
const User = require('../models/user');
const response = require('../utils/response');

let type = 'login'

async function registerUser(res, email) {
    const validation = await validator.validate(email)
    if (!validation.valid) return response.forbiddenError(res, "email is not valid")

    const token = jwt.generateAccessToken(email)
    const user = User({email: email}).save()
    const sendEmail = smtp.sendEmail(email, 'Welcome to Foodies', templates.welcome)
    const updateEmails = smtp.updateEmails(email);
    await Promise.all([user, sendEmail, token, updateEmails])

    type = 'signup'
    return token
}

exports.register = async (req, res) => {
    const email = req.body.email
    let token = {}
    try {
        const user = await User.findOne({email: email})
        if (user) token = await jwt.generateAccessToken(email)
        else token = await registerUser(res, email)
        res.status(200).json({token, type})
    } catch (e){ response.serverError(res, e.message)}
}

exports.updateUser = async (req, res) => {
    try {
        req.user.lastUpdate = new Date().getDate()
        await req.user.save()
        res.status(202).json({message: 'success'})
    } catch (e){ response.serverError(res, e.message)}
}
