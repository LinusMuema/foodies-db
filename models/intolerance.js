const mongoose = require('mongoose');

exports.Intolerance = mongoose.model("Intolerance",
    new mongoose.Schema({
        name: String,
        image_url: String
    })
);
