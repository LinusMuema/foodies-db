const validator = require('deep-email-validator');
const jwt = require('../utils/jwt');
const smtp = require('../utils/smtp')
const templates = require('../views/templates')
const User = require('../models/user');
const response = require('../utils/response');
const cloudinary = require('../utils/cloudinary');
const bcrypt = require('../utils/bcrypt');

let type = 'login'

// //Authentication update
// exports.authenticate = async (req, res) => {
//     const email = req.body.email
//     const password = req.body.password
//     let token = {}
//     try {
//         const user = await User.findOne({email: email})
//         if (user){
//             if (user.password === undefined){
//                 user.password = await bcrypt.hashPassword(password)
//                 token = await jwt.generateAccessToken(email)
//                 user.save()
//             }
//             else {
//                 const verify = await bcrypt.verifyPassword(password, user.password)
//                 if (verify) token = await jwt.generateAccessToken(email)
//                 else return response.forbiddenError(res, "passwords do not match")
//             }
//         }
//         else token = await altRegister(res, req.body)
//         res.status(200).json({token, type})
//     } catch (e){ response.serverError(res, e.message)}
// }
//
// async function altRegister(res, body){
//     const validation = await validator.validate(body.email)
//     if (!validation.valid) return response.forbiddenError(res, "email is not valid")
//
//     const token = jwt.generateAccessToken(body.email)
//     const hash = await bcrypt.hashPassword(body.password)
//     const user = User({email: body.email, password: hash}).save()
//     const sendEmail = smtp.sendEmail(body.email, 'Welcome to Foodies', templates.welcome)
//     const updateEmails = smtp.updateEmails(body.email);
//     await Promise.all([user, sendEmail, token, updateEmails])
//
//     type = 'signup'
//     return token
// }

exports.upload = async (req, res) => {
    try {
        const avatar = await cloudinary.uploadAvatar(req.user._id, req.file.path)
        res.status(200).json({avatar: avatar})
    } catch (e){ response.serverError(res, e.message)}
}

exports.update = async  (req, res) => {
    try {
        const exists = await User.findOne({username: req.body.username})
        if (!exists){
            req.user.username = req.body.username
            req.user.avatar = req.body.avatar
            await req.user.save()
            res.status(200).json({updated: true})
        } else return response.forbiddenError(res, "the username is already taken")
    } catch (e){ response.serverError(res, e.message)}
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

exports.updateUser = async (req, res) => {
    try {
        req.user.lastUpdate = new Date().getDate()
        await req.user.save()
        res.status(202).json({message: 'success'})
    } catch (e){ response.serverError(res, e.message)}
}
