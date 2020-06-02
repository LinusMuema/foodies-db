const recipeModels = require('../models/recipe')
const userModel = require('../models/user')
const axios = require('axios')
const utils = require('../utils/utils')

exports.getRandomRecipes = (req, res) => {
    let intolerances= ''
    userModel.findById(req._id)
        .then(user => {
            if (!user) return utils.handleNoUserError(res)
            user.intolerances.forEach((intolerance) => {
                intolerances += intolerance.name
            })
            axios.get(`https://api.spoonacular.com/recipes/complexSearch?number=5&query=any&intolerances=${intolerances},&instructionsRequired=true&sort=random&apiKey=${process.env.SPOONACULAR_API_KEY}`)
                .then(response => {res.status(200).json({message: 'success', recipes: response.data.results})})
                .catch(error => {utils.handleServerError(res, error)})
        })
        .catch(error => {utils.handleServerError(res, error)})
}

exports.getRecipeById = (req, res) => {
    let ingredients = [];
    let equipment = [];
    let processes = [];
    axios.get(`https://api.spoonacular.com/recipes/${req.params.id}/analyzedInstructions?apiKey=${process.env.SPOONACULAR_API_KEY}`)
        .then(response => {
            response.data.forEach((process) => {
                let steps  = []
                process.steps.forEach((item) => {
                    let step = new recipeModels.Step({number: item.number, instruction: item.step})
                    steps.push(step)
                    ingredients = ingredients.concat(item.ingredients)
                    equipment = equipment.concat(item.equipment)
                })
                processes.push(new recipeModels.Process({name: process.name, steps: steps}))
            })
            res.status(200).json({message: 'success',ingredients, equipment, processes})
        })
        .catch(error => {utils.handleServerError(res, error)})
}
