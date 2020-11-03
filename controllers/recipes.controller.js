const userModel = require('../models/user')
const utils = require('../utils/utils')
const api = require('../utils/api')
const responseHandler = require('../utils/responseHandler')

exports.getRandomRecipes = (req, res) => {
    userModel.User.findById(req._id)
        .then(user => {
            api.getJoke()
                .then(joke => {
                    api.getTrivia()
                        .then(trivia => {
                            api.getRandomRecipes(user.intolerances.map(item => item.name).join(','), req.calls)
                                .then(response => {
                                    let count = 0;
                                    let recipes = [];
                                    response.forEach((info, index, array) => {
                                    let id = info.id
                                    api.getRecipeInstructions(id)
                                        .then(instructions => {
                                            count++
                                            recipes.push({id,info, instructions})
                                            if(count === array.length){
                                                utils.updateCalls(user)
                                                res.status(200).json({message: 'success', recipes, joke, trivia})
                                            }
                                        })
                                        .catch(error => {responseHandler.handleServerError(res, error)})
                                })
                                })
                                .catch(error => {responseHandler.handleServerError(res, error)})
                        })
                        .catch(error => {responseHandler.handleServerError(res, error)})
                })
                .catch(error => {responseHandler.handleServerError(res, error)})
        })
        .catch(error => {responseHandler.handleServerError(res, error)})
}

exports.getFavorites = (req, res) => {
    userModel.User.findById(req._id)
        .then(user => {
            let favorites = user.favorites
            res.status(200).json({message: 'success', favorites})
        })
        .catch(error => {responseHandler.handleServerError(res, error)})
}

exports.updateFavorites = (req, res) => {
    userModel.User.findOneAndUpdate(req._id, {$set : {favorites : req.body.recipes}})
        .then(result => {console.log(result)})
        .catch(error => {responseHandler.handleServerError(res, error)})
}


exports.getRecipeByName = (req, res) => {
    userModel.User.findById(req._id)
        .then(user => {
            api.searchRecipeVideos(req.params.query)
                .then(videos => {
                    api.searchRecipe(req.params.query, user.intolerances.map(item => item.name).join(','))
                        .then(recipes => {
                            res.status(200).json({message: 'success', recipes, videos})
                            utils.updateSearchCalls(user)
                        })
                        .catch(error => {responseHandler.handleServerError(res, error)})
                })
                .catch(error => {responseHandler.handleServerError(res, error)})
        })
        .catch(error => {responseHandler.handleServerError(res, error)})
}

exports.getRecipesByIngredients = (req, res) => {
    userModel.User.findById(req._id)
        .then(user => {
            api.searchRecipeByIngredients(req.params.ingredients)
                .then(recipes => {
                    utils.updateSearchCalls(user)
                    res.status(200).json({message: 'success', recipes})
                })
                .catch(error => {responseHandler.handleServerError(res, error)})
        })
        .catch(error => {responseHandler.handleServerError(res, error)})
}

exports.getRecipeById = (req, res) => {
    userModel.User.findById(req._id)
        .then(user => {
            api.getRecipeInstructions(req.params.id)
                .then(instructions => {
                    utils.updateSearchCalls(user)
                    res.status(200).json({message: 'success', instructions})
                })
                .catch(error => {responseHandler.handleServerError(res, error)})
        })
        .catch(error => {responseHandler.handleServerError(res, error)})
}
