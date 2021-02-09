const express = require('express')
const router = express.Router()
const middleware = require('../middleware')
const controller = require('../controllers/recipes.controller')

router.get('/:id', middleware.verify, controller.getRecipeById)

router.get('/', [middleware.verify, middleware.checkLimit], controller.getRandomRecipes)

router.get('/favorites', middleware.verify, controller.getFavorites)

router.post('/favorites', middleware.verify, controller.updateFavorites)

router.get('/search/:query', middleware.verify, controller.getRecipeByName)

router.get('/ingredients/:ingredients', middleware.verify, controller.getRecipesByIngredients)

module.exports = router
