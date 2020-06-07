const userModel = require('../models/user')
const utils = require('../utils/utils')
const api = require('../utils/api')

exports.getRandomRecipes = (req, res) => {
    let count = 0;
    let recipes = [];
    userModel.User.findById(req._id)
        .then(user => {
            api.getRandomRecipes(user.intolerances.map(item => item.name).join(','))
                .then(response => {
                    response.forEach((info, index, array) => {
                        api.getRecipeInstructions(info.id)
                            .then(instructions => {
                                count++
                                recipes.push({info, instructions})
                                if(count === array.length){
                                    res.status(200).json({message: 'success', recipes})
                                }
                            })
                            .catch(error => {utils.handleServerError(res, error)})
                    })
                })
                .catch(error => {utils.handleServerError(res, error)})
        })
        .catch(error => {utils.handleServerError(res, error)})
}

exports.getFavorites = (req, res) => {
    userModel.User.findById(req._id)
        .then(user => {
            let favorites = user.favorites
            res.status(200).json({message: 'success', favorites})
        })
        .catch(error => {utils.handleServerError(res, error)})
}

exports.addFavorites = (req, res) => {
    userModel.User.findById(req._id)
        .then(user => {
            if (user.favorites.length >= 10) return res.status(403).json({message: 'error', reason: 'maximum favorites reached'})
            user.favorites.push(req.body.recipe)
            user.markModified('favorites')
            user.save()
                .then(result => {res.status(200).json({message: 'success', updated: true})})
                .catch(error => {utils.handleServerError(res, error)})
        })
        .catch(error => {utils.handleServerError(res, error)})
}
