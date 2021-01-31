const mongoose = require('mongoose');

const schema = new mongoose.Schema({email: String, favorites: [], intolerances: [], lastLimit: String})
const user = mongoose.model("User", schema)

module.exports = user
