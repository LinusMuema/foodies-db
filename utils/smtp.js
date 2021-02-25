const nodemailer = require("nodemailer");
const axios = require('axios');
const api = axios.create({
    baseURL: 'https://api.sendinblue.com/v3/',
    headers: {
        "api-key": process.env.SENDINBLUE_API_KEY
    }
})

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

exports.updateEmails = async (email) => {
    return api.post('/contacts', {email: email})
}
