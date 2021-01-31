const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.sendinblue.com',
    port: 587,
    auth: {
        user: 'linus.m.muema@gmail.com',
        pass: process.env.SMTP_KEY
    }
});

exports.sendEmail = async (recipient, subject, html) => {
    const mailOptions = {
        from: '"Admin" <admin@moose.ac>',
        to: recipient,
        subject: subject,
        html: html
    }
    return transporter.sendMail(mailOptions)
}

exports.generateAccessToken = async (email) => {
    const payload = `${Date},${email}`
    return jwt.sign(payload, process.env.TOKEN_SECRET);
}
