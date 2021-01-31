const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");
const sendinBlue = require('nodemailer-sendinblue-transport');
const transporter = nodemailer.createTransport(sendinBlue({apiKey: process.env.SENDINBLUE_API_KEY}));

exports.sendEmail = async (recipient, subject, html) => {
    const mailOptions = {from: 'moose.foodies@gmail.com', to: recipient, subject: subject, html: html};
    return transporter.sendMail(mailOptions)
}

exports.generateAccessToken = async (email) => {
    const payload = `${Date},${email}`
    return jwt.sign(payload, process.env.TOKEN_SECRET);
}
