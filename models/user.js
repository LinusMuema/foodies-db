const mongoose = require('mongoose');

exports.User = mongoose.model("User",
    new mongoose.Schema({
        email: String,
        password: String,
        intolerances: [],
        update: {
            type: Number,
            default: new Date().getDate()
        },
        confirmed:{
            type: Boolean,
            default: false
        }
    })
);
