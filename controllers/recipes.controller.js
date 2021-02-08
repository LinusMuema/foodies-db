const api = require('../utils/api')

exports.getRandomRecipes = async (req, res) => {
    try {
        const intolerances = req.user.intolerances.map(item => item.name)
        const data = await api.getRandomRecipes(intolerances)
        const [joke, trivia, recipes] = await Promise.all([api.getJoke(), api.getTrivia(), getInstructions(data)])
        res.status(200).json({joke, trivia, recipes})

        // Post request update
        req.user.lastUpdate = new Date().getDate()
        req.user.save()
    } catch (err){
        res.status(500).json({message: err.message})
    }

    async function getInstructions(recipes){
        const instructions = recipes.map(async recipe => {
            const instructions = await api.getRecipeInstructions(recipe.id)
            return {id: recipe.id, info: recipe, instructions}
        })
        return await Promise.all(instructions)
    }
}

exports.getFavorites = async (req, res) => {
    res.status(200).json(req.user.favorites)
}

exports.updateFavorites = async (req, res) => {
    try {
        req.user.favorites = req.body.recipes
        const update = await req.user.save()
        res.status(200).json(update)
    } catch (err){
        res.status(500).json({message: err.message})
    }
}


exports.getRecipeByName = async (req, res) => {
    try {
        const intolerances = req.user.intolerances.map(item => item.name)
        const query = req.params.query
        const [videos, recipes] = await Promise.all([api.searchRecipeVideos(query), api.searchRecipe(query, intolerances)])
        res.status(200).json({recipes, videos})
    } catch (err){
        res.status(500).json({message: err.message})
    }
}

exports.getRecipesByIngredients = async (req, res) => {
    try {
        const recipes = await api.searchRecipeByIngredients(req.params.ingredients)
        res.status(200).json(recipes)
    } catch (err){
        res.status(500).json({message: err.message})
    }
}

exports.getRecipeById = async (req, res) => {
    try {
        const info = await api.getRecipeById(req.params.id)
        const recipe = await api.getRecipeInstructions(req.params.id)
        recipe.info = info
        recipe.id = req.params.id
        res.status(200).json(recipe)
    } catch (err){
        res.status(500).json({message: err.message})
    }
}
