const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");
const sendinBlue = require('nodemailer-sendinblue-transport');

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

exports.generateAccessToken = async (email) => {
    const payload = `${Date},${email}`
    return jwt.sign(payload, process.env.TOKEN_SECRET);
}
