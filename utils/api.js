const axios = require('axios')
const recipeModel = require('../models/recipe')

exports.getRandomRecipes = (intolerances) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://api.spoonacular.com/recipes/complexSearch?number=5&query=any&intolerances=${intolerances},&instructionsRequired=true&sort=random&apiKey=${process.env.SPOONACULAR_API_KEY}`)
            .then(response => {resolve(response.data.results)})
            .catch(error => {reject(error)})
    })
}

exports.getRecipeInstructions = (id) => {
    let ingredients = [];
    let equipment = [];
    let sections = [];
    return new Promise((resolve, reject) => {
        axios.get(`https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=${process.env.SPOONACULAR_API_KEY}`)
            .then(response => {
                response.data.forEach((process) => {
                    let steps  = []
                    process.steps.forEach((item) => {
                        let step = new recipeModel.Step({number: item.number, instruction: item.step})
                        steps.push(step)
                        ingredients = ingredients.concat(item.ingredients)
                        equipment = equipment.concat(item.equipment)
                    })
                    sections.push(new recipeModel.Section({name: process.name, steps: steps}))
                })
                resolve({ingredients, equipment, sections})
            })
            .catch(error => {reject(error)})
    })
}
