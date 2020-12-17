const mongoose = require('mongoose')

exports.Step = mongoose.model("Step",
    new mongoose.Schema({
        number: Number,
        instruction: String
    })
);

exports.Section = mongoose.model("Section",
    new mongoose.Schema({
        name: String,
        steps: []
    })
);

exports.Recipe = mongoose.model("Recipe",
    new mongoose.Schema({
        info: Object,
        instructions:Object
    })
)

exports.Favorites = mongoose.model("Favorite",
    new mongoose.Schema({
        recipes: [],
        user: String,
    })
)
