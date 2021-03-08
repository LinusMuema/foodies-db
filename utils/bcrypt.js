const bcrypt = require('bcrypt');

exports.verifyPassword = async (password, hash) => bcrypt.compare(password, hash)

exports.hashPassword = async (password) => {
    const rounds = Math.floor(Math.random() * 10) + 1
    return bcrypt.hash(password, rounds)
}
