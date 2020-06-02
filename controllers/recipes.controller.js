const Recipe = require('../models/recipe')
const User = require('../models/user')
const axios = require('axios')
const utils = require('../utils/utils')
const spoonacular = require('spoonacular_api');
const api = new spoonacular.DefaultApi()
var q = `salmon with fusilli and no nuts`; // {String} The recipe search query.
var callback = function(error, data, response) {
    if (error) {
        console.error(error);
    } else {
        console.log('API called successfully. Returned data: ' + data);
    }
};

exports.getRandomRecipes = (req, res) => {
    let intolerances= ''
    User.findById(req._id)
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
                    let step = new Recipe.Step({number: item.number, instruction: item.step})
                    steps.push(step)
                    ingredients = ingredients.concat(item.ingredients)
                    equipment = equipment.concat(item.equipment)
                })
                processes.push(new Recipe.Process({name: process.name, steps: steps}))
            })
            res.status(200).json({message: 'success',ingredients, equipment, processes})
        })
        .catch(error => {utils.handleServerError(res, error)})
}
