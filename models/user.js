const mongoose = require('mongoose');

const model = new mongoose.Schema({
    email: String,
    password: String,
    intolerances: [],
    confirmed:{
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("User", model);
