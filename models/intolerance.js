const mongoose = require('mongoose');

const schema = new mongoose.Schema({ name: String, image: String })
const intolerance = mongoose.model("Intolerance", schema)

module.exports = intolerance
