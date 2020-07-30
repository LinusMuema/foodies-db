const express = require('express')
const router = express.Router()
const middleware = require('../middleware')
const controller = require('../controllers/recipes.controller')

router.get('/one/:id', [middleware.verify, middleware.checkSearchesUpdate], controller.getRecipeById)

router.get('/random', [middleware.verify, middleware.checkRecipeUpdate], controller.getRandomRecipes)

router.get('/favorites', [middleware.verify], controller.getFavorites)

router.get('/search/:query', [middleware.verify, middleware.checkSearchesUpdate], controller.getRecipeByName)

router.get('/search/ingredients/:ingredients', [middleware.verify, middleware.checkSearchesUpdate], controller.getRecipesByIngredients)

module.exports = router
