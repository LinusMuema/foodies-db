const express = require('express')
const router = express.Router()
const middleware = require('../middleware')
const controller = require('../controllers/recipes.controller')

router.get('/random', [middleware.verify, middleware.checkRecipeUpdate], controller.getRandomRecipes)

router.get('/:id/instructions', [middleware.verify, middleware.checkIfFavorite], controller.getRecipeById)

router.post('/:id/favorites', middleware.verify, controller.addFavorite)

module.exports = router
