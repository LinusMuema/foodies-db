const mongoose = require('mongoose')

exports.Step = mongoose.model("Step",
    new mongoose.Schema({
        number: Number,
        instruction: String
    })
);

exports.Process = mongoose.model("Process",
    new mongoose.Schema({
        name: String,
        steps: []
    })
);
