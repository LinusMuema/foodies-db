const userModel = require('../models/user')
const utils = require('../utils/utils')
const api = require('../utils/api')

exports.getRandomRecipes = (req, res) => {
    let count = 0;
    let recipes = [];
    userModel.User.findById(req._id)
        .then(user => {
            api.getJoke()
                .then(joke => {
                    api.getTrivia()
                        .then(trivia => {
                            api.getRandomRecipes(user.intolerances.map(item => item.name).join(','))
                                .then(response => {response.forEach((info, index, array) => {
                                    let id = info.id
                                    api.getRecipeInstructions(id)
                                        .then(instructions => {
                                            count++
                                            recipes.push({id,info, instructions})
                                            if(count === array.length){
                                                res.status(200).json({message: 'success', recipes, joke, trivia})
                                            }
                                        })
                                        .catch(error => {utils.handleServerError(res, error)})
                                })
                                })
                                .catch(error => {utils.handleServerError(res, error)})
                        })
                        .catch(error => {utils.handleServerError(res, error)})
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
            if (user.favorites.recipes.length >= 10) return res.status(403).json({message: 'error', reason: 'maximum favorites reached'})
            user.favorites = req.body.backup
            user.markModified('favorites')
            user.save()
                .then(result => {res.status(200).json({message: 'success', updated: true})})
                .catch(error => {utils.handleServerError(res, error)})
        })
        .catch(error => {utils.handleServerError(res, error)})
}
