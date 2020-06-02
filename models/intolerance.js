const mongoose = require('mongoose');

const model = new mongoose.Schema({
    name: String,
    image_url: String
});

module.exports = mongoose.model("Intolerance", model);
