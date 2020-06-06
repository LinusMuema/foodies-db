const mongoose = require('mongoose');

exports.User = mongoose.model("User",
    new mongoose.Schema({
        email: String,
        password: String,
        intolerances: [],
        update: [oooo],
        confirmed:{
            type: Boolean,
            default: false
        }
    })
);
