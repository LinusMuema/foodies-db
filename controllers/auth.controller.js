const userModel = require('../models/user');
const bcrypt = require('bcrypt');
const pug = require('pug');
const utils = require('../utils/utils')
const responseHandler = require('../utils/responseHandler')

const noUserMessage = 'No user with that email found. Please use the email registered during signup';
const serverErrorMessage = 'Something went wrong! Please try again later.';
const passwordErrorMessage = 'check your password and try again!';

exports.login = (req, res) => {
    userModel.User.findOne({email: req.body.email})
        .then(user => {
            if ((!user)){
                utils.hashPassword(req.body.password)
                    .then(pass => {
                        userModel.User({email: req.body.email,  password: pass, update:["0,0", "0,0"]}).save()
                            .then(user => {
                                const email = user.email;
                                const html = pug.renderFile("views/welcome.pug", {email});
                                utils.sendEmail(req.body.email, 'Welcome to Foodies', html)
                                    .then(_ => {res.status(200).json({message: 'success',type: 'signup', token: utils.generateAccessToken(user)});})
                                    .catch(_ => responseHandler.handleServerError(res, 'error sending email'))
                            })
                            .catch(_ => responseHandler.handleServerError(res, 'error saving user'))
                    })
                    .catch(_ => responseHandler.handleServerError(res, 'error hashing password'))
            }
            else{
                if (!user.confirmed) return responseHandler.handleForbiddenError(res, "please confirm your email")
                bcrypt.compare(req.body.password, user.password, (error, same) => {
                    if (error) return;
                    if (same) res.json({message: 'success', type: 'login', token: utils.generateAccessToken(user)})
                    else responseHandler.handleForbiddenError(res, "passwords do not match")
                })
            }
        })
        .catch(_ => responseHandler.handleServerError(res, 'error reading database'))
}

exports.confirmAccount = (req, res) => {
    userModel.User.findOne({email : req.body.email})
        .then(user => {
            if(!user) return utils.loadError(res, noUserMessage);
            bcrypt.compare(req.body.password, user.password, (err, same) => {
                if (err) return utils.loadError(res, serverErrorMessage);
                if (!same) return utils.loadError(res, passwordErrorMessage);
                userModel.User.updateOne({email: req.body.email}, {confirmed: true})
                    .then( _ => {utils.loadSuccess(res, "Your email has been confirmed. Now you can enjoy our app without any issues.")})
                    .catch(_ => {utils.loadError(res, serverErrorMessage)})
            })
        })
        .catch( _ => {utils.loadError(res, serverErrorMessage)})
}

exports.resetEmail = (req, res) => {
    const email = req.params.email;
    const html = pug.renderFile("views/reset.pug", {email});
    const subject = 'Reset password'
    utils.sendEmail(email, subject, html)
        .then(_ => {res.status(200).json({message: 'success', reason: 'Reset email sent successfully'})})
        .catch(_ => responseHandler.handleServerError(res, 'error sending email'))
}

exports.postReset = (req, res) => {
    userModel.User.findOne({email: req.body.email})
        .then(user => {
            if (!user) return utils.loadError(res, noUserMessage)
            utils.hashPassword(req.body.password)
                .then(pass => {
                    userModel.User.updateOne({email: req.body.email}, {password: pass})
                        .then(_ => {utils.loadSuccess(res, "Your password has been reset. Go back and try to login with the new password.")})
                        .catch(_ => {utils.loadError(res, serverErrorMessage)})
                })
                .catch(_ => {utils.loadError(res, serverErrorMessage)})
        })
        .catch(_ => {utils.loadError(res, serverErrorMessage)})
}

exports.resetForm = (req, res) => {res.render('reset_form')}

exports.confirm = (req, res) => {res.render('confirm')}
