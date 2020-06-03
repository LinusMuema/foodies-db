const userModel = require('../models/user');
const bcrypt = require('bcrypt');
const pug = require('pug');
const utils = require('../utils/utils')

const noUserMessage = 'No user with that email found. Please use the email registered during signup';
const serverErrorMessage = 'Something went wrong! Please try again later.';
const passwordErrorMessage = 'check your password and try again!';

exports.login = (req, res) => {
    userModel.User.findOne({email: req.body.email})
        .then(user => {
            if ((!user)){
                utils.hashPassword(req.body.password)
                    .then(pass => {
                        userModel.User({email: req.body.email,  password: pass, update:["0,0"]}).save()
                            .then(user => {
                                const email = user.email;
                                const html = pug.renderFile("views/welcome.pug", {email});
                                utils.sendEmail(req.body.email, 'Welcome to Foodies', html)
                                    .then(info => {res.status(200).json({message: 'success',type: 'signup', token: utils.generateAccessToken(user)});})
                                    .catch(error => {res.status(500).json({message: 'error', reason: 'error sending email', error})})
                            })
                            .catch(error => {res.status(500).json({message: 'error', reason: error})});
                    })
                    .catch(error => {res.status(500).json({message: 'error', reason: 'password hashing error', error})})
            }
            else{
                if (!user.confirmed) return res.status(403).json({message: 'error', reason: 'please confirm your email.'});
                bcrypt.compare(req.body.password, user.password, (error, same) => {
                    if (error) return;
                    if (same) {res.json({message: 'success', type: 'login', token: utils.generateAccessToken(user)})}
                    else {res.status(403).json({message: 'error', reason: 'incorrect password'})}
                })
            }
        })
        .catch(error => {res.status(500).json({message: 'error', error})})
}

exports.confirmAccount = (req, res) => {
    userModel.User.findOne({email : req.body.email})
        .then(user => {
            if(!user) return utils.loadError(res, noUserMessage);
            bcrypt.compare(req.body.password, user.password, (err, same) => {
                if (err) return utils.loadError(res, serverErrorMessage);
                if (!same) return utils.loadError(res, passwordErrorMessage);
                userModel.User.updateOne({email: req.body.email}, {confirmed: true})
                    .then( update => {utils.loadSuccess(res, "Your email has been confirmed. Now you can enjoy our app without any issues.")})
                    .catch(error => {utils.loadError(res, serverErrorMessage)})
            })
        })
        .catch( error => {utils.loadError(res, serverErrorMessage)})
}

exports.resetEmail = (req, res) => {
    userModel.User.findOne({email: req.params.email})
        .then(user => {
            if(!user) return res.status(404).json({message: 'error', reason: noUserMessage})
            const email = req.params.email;
            const html = pug.renderFile("views/reset.pug", {email});
            const subject = 'Reset password'
            utils.sendEmail(email, subject, html)
                .then(info => {res.status(200).json({message: 'success', reason: 'Reset email sent successfully'})})
                .catch(error => { res.status(500).json({message: 'error', reason: serverErrorMessage})})
        })
        .catch(error => {res.status(500).json({message: 'error', reason: serverErrorMessage})})
}

exports.postReset = (req, res) => {
    userModel.User.findOne({email: req.body.email})
        .then(user => {
            if (!user) return utils.loadError(res, noUserMessage)
            utils.hashPassword(req.body.password)
                .then(pass => {
                    userModel.User.updateOne({email: req.body.email}, {password: pass})
                        .then( update => {utils.loadSuccess(res, "Your password has been reset. Go back and try to login with the new password.")})
                        .catch(error => {utils.loadError(res, serverErrorMessage)})
                })
                .catch(error => {utils.loadError(res, serverErrorMessage)})
        })
        .catch(error => {utils.loadError(res, serverErrorMessage)})
}

exports.resetForm = (req, res) => {res.render('reset_form')}

exports.confirm = (req, res) => {res.render('confirm')}
