const axios = require('axios')
const recipeModel = require('../models/recipe')

const api = axios.create({
    baseURL: 'https://api.spoonacular.com/',
    timeout: 10000
})

exports.getRandomRecipes = (intolerances) => {
    return new Promise((resolve, reject) => {
        api.get(`recipes/complexSearch?number=5&query=any&intolerances=${intolerances},&instructionsRequired=true&sort=random&apiKey=${process.env.SPOONACULAR_API_KEY}`)
            .then(response => {resolve(response.data.results)})
            .catch(error => {reject(error)})
    })
}

exports.getRecipeInstructions = (id) => {
    let ingredients = [];
    let equipment = [];
    let sections = [];
    return new Promise((resolve, reject) => {
        api.get(`recipes/${id}/analyzedInstructions?apiKey=${process.env.SPOONACULAR_API_KEY}`)
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

exports.getJoke = () => {
    return new Promise((resolve, reject) => {
        api.get(`food/jokes/random?apiKey=${process.env.SPOONACULAR_API_KEY}`)
            .then(response => {resolve(response.data.text)})
            .catch(error => {reject(error)})
    })
}

exports.getTrivia = () => {
    return new Promise((resolve, reject) => {
        api.get(`food/trivia/random?apiKey=${process.env.SPOONACULAR_API_KEY}`)
            .then(response => {resolve(response.data.text)})
            .catch(error => {reject(error)})
    })
}

exports.searchRecipeVideos = (name) => {
    return new Promise((resolve, reject) => {
        api.get(`food/videos/search?query=${name}&number=5&apiKey=${process.env.SPOONACULAR_API_KEY}`)
            .then(response => {resolve(response.data.videos)})
            .catch(error => {reject(error)})
    })
}

exports.searchRecipe = (name, intolerances) => {
    return new Promise((resolve, reject) => {
        api.get(`recipes/search?number=5&query=${name}&intolerances=${intolerances},&instructionsRequired=true&apiKey=${process.env.SPOONACULAR_API_KEY}`)
            .then(response => {resolve(response.data.results)})
            .catch(error => {reject(error)})
    })
}

exports.searchRecipeByIngredients = (ingredients) => {
    return new Promise((resolve, reject) => {
        api.get(`recipes/findByIngredients?number=5&ingredients=${ingredients},&ranking=1&ignorePantry=true&instructionsRequired=true&apiKey=${process.env.SPOONACULAR_API_KEY}`)
            .then(response => {resolve(response.data)})
            .catch(error => {reject(error)})
    })
}

exports.getRecipeById = (id) => {
    return new Promise((resolve, reject) => {

    })
}
