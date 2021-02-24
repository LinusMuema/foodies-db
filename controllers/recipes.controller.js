const api = require('../utils/api');
const response =  require('../utils/response');

exports.getRandomRecipes = async (req, res) => {
    try {
        const intolerances = req.user.intolerances.map(item => item.name)
        const data = await api.getRandomRecipes(intolerances)
        const [joke, trivia, recipes] = await Promise.all([api.getJoke(), api.getTrivia(), getInstructions(data)])
        res.status(200).json({joke, trivia, recipes})
    } catch (e){ response.serverError(res, e.message) }

    async function getInstructions(recipes){
        const instructions = recipes.map(async recipe => {
            const instructions = await api.getRecipeInstructions(recipe.id)
            return {id: recipe.id, info: recipe, instructions}
        })
        return await Promise.all(instructions)
    }
}

exports.getFavorites = async (req, res) => {
    try { res.status(200).json(req.user.favorites)}
    catch (e){ response.serverError(res, e.message) }
}

exports.updateFavorites = async (req, res) => {
    try {
        req.user.favorites = req.body.recipes
        await req.user.save()
        res.status(200).json({status: 'success'})
    } catch (e){ response.serverError(res, e.message) }
}


exports.searchRecipes = async (req, res) => {
    try {
        const intolerances = req.user.intolerances.map(item => item.name)
        const query = req.params.query
        const [videos, recipes] = await Promise.all([api.searchRecipeVideos(query), api.searchRecipe(query, intolerances)])
        res.status(200).json({recipes, videos})
    } catch (e){ response.serverError(res, e.message) }
}

exports.getRecipesByIngredients = async (req, res) => {
    try {
        const recipes = await api.searchRecipeByIngredients(req.params.ingredients)
        res.status(200).json(recipes)
    } catch (e){ response.serverError(res, e.message) }
}

exports.getRecipeById = async (req, res) => {
    const id = parseInt(req.params.id)
    try {
        const [info, instructions] = await Promise.all([api.getRecipeById(id), api.getRecipeInstructions(id)])
        res.status(200).json({id, info, instructions})
    } catch (e){ response.serverError(res, e.message) }
}
