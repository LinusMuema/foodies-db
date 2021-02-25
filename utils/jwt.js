const jwt = require('jsonwebtoken')

exports.generateAccessToken = async (email) => {
    const payload = `${Date},${email}`
    return jwt.sign(payload, process.env.TOKEN_SECRET);
}
