const axios = require('axios')
const recipeModel = require('../models/recipe')
const apiKey = process.env.SPOONACULAR_API_KEY
const api = axios.create({
    baseURL: 'https://api.spoonacular.com/',
    timeout: 10000
})

exports.getRandomRecipes = async (intolerances) => {
    const url = `recipes/complexSearch?number=10&query=any&intolerances=${intolerances},&instructionsRequired=true&sort=random&apiKey=${apiKey}`
    const request = await api.get(url)
    return request.data.results;
}

exports.getRecipeInstructions = async (id) => {
    let ingredients = [];
    let equipment = [];
    let sections = [];
    const instructions = await api.get(`recipes/${id}/analyzedInstructions?apiKey=${apiKey}`)
    instructions.data.forEach(instruction => {
        const steps = []
        instruction.steps.forEach(step => {
            steps.push({number: step.number, instruction: step.step})
            ingredients = ingredients.concat(step.ingredients)
            equipment = equipment.concat(step.equipment)
        })
        sections.push(new recipeModel.Section({name: process.name, steps: steps}))
    })

    return {ingredients, equipment, sections}
}

exports.getJoke = async () => {
    const request = await api.get(`food/jokes/random?apiKey=${apiKey}`)
    return request.data.text
}

exports.getTrivia = async () => {
    const request = await api.get(`food/trivia/random?apiKey=${apiKey}`)
    return request.data.text
}

exports.searchRecipeVideos = (name) => {
    return new Promise((resolve, reject) => {
        api.get(`food/videos/search?query=${name}&number=5&apiKey=${apiKey}`)
            .then(response => {resolve(response.data.videos)})
            .catch(error => {reject(error)})
    })
}

exports.searchRecipe = (name, intolerances) => {
    return new Promise((resolve, reject) => {
        api.get(`recipes/search?number=5&query=${name}&intolerances=${intolerances},&instructionsRequired=true&apiKey=${apiKey}`)
            .then(response => {resolve(response.data.results)})
            .catch(error => {reject(error)})
    })
}

exports.searchRecipeByIngredients = (ingredients) => {
    return new Promise((resolve, reject) => {
        api.get(`recipes/findByIngredients?number=5&ingredients=${ingredients},&ranking=1&ignorePantry=true&instructionsRequired=true&apiKey=${apiKey}`)
            .then(response => {resolve(response.data)})
            .catch(error => {reject(error)})
    })
}
