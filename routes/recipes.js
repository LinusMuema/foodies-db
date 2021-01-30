const express = require('express')
const router = express.Router()
const middleware = require('../middleware')
const controller = require('../controllers/recipes.controller')

router.get('/one/:id', middleware.verify, controller.getRecipeById)

router.get('/random', middleware.verify, controller.getRandomRecipes)

router.get('/favorites', middleware.verify, controller.getFavorites)

router.post('/favorites', middleware.verify, controller.updateFavorites)

router.get('/search/:query', middleware.verify, controller.getRecipeByName)

router.get('/search/ingredients/:ingredients', middleware.verify, controller.getRecipesByIngredients)

module.exports = router
