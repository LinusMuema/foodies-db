const mongoose = require('mongoose');

const schema = new mongoose.Schema({email: String, favorites: [], intolerances: [], lastUpdate: Number})
const user = mongoose.model("User", schema)

module.exports = user
