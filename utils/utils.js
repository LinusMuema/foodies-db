const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const sendinBlue = require('nodemailer-sendinblue-transport');

exports.hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        const rounds = Math.floor(Math.random() * (10 - 1) + 1);
        bcrypt.hash(password, rounds, (error, pass) => {
            if (error) reject(error);
            else resolve(pass)
        })
    })
}

exports.sendEmail =(recipient, subject, html) => {
    const transporter = nodemailer.createTransport(sendinBlue({apiKey: process.env.SENDINBLUE_API_KEY}));
    const mailOptions = {from: 'moose.foodies@gmail.com', to: recipient, subject: subject, html: html};
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) reject(error);
            else resolve(info);
        });
    })
}

exports.generateAccessToken = (user) => {
    let date = new Date()
    let payload = `${user._id}.${user.premium}.${date.getMilliseconds()}`;
    return jwt.sign(payload, process.env.TOKEN_SECRET);
}

exports.updateCalls = (user) => {
    let calls = user.update[0].split(",")[1]
    user.update[0] = `${new Date().getDate()},${parseInt(calls) + 1}`
    user.markModified('update')
    return user.save()
}

exports.updateSearchCalls = (user) => {
    let calls = user.update[1].split(",")[1]
    user.update[1] = `${new Date().getDate()},${parseInt(calls) + 1}`
    user.markModified('update')
    return user.save()
}

exports.loadError = (res, message) => {
    const type = "error";
    const image = '/images/error.png';
    res.render('info', {type, message, image})
}

exports.loadSuccess = (res, message) => {
    const type = "success";
    const image = '/images/success.png';
    res.render('info', {type, message, image})
}
