const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    email: String,
    password: String,
    username: String,
    avatar: String,
    favorites: [],
    recipes: [],
    intolerances: [],
    premium: {type: Boolean, default: false},
    lastUpdate: Number
})
const user = mongoose.model("User", schema)

module.exports = user
