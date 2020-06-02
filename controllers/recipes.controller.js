const Recipe = require('../models/recipe')
const User = require('../models/user')
const axios = require('axios')
const utils = require('../utils/utils')

exports.getRandomRecipes = (req, res) => {
    let intolerances= ''
    User.findById(req._id)
        .then(user => {
            if (!user) return utils.handleNoUserError(res)
            user.intolerances.forEach((intolerance) => {
                intolerances += intolerance.name
            })
            axios.get(`https://api.spoonacular.com/recipes/complexSearch?number=5&query=any&intolerances=${intolerances},&sort=random&apiKey=${process.env.SPOONACULAR_API_KEY}`)
                .then(response => {res.status(200).json({message: 'success', recipes: response.data.results})})
                .catch(error => {utils.handleServerError(res, error)})
        })
        .catch(error => {utils.handleServerError(res, error)})
}
