const express = require('express')
const router = express.Router()
const middleware = require('../middleware')
const controller = require('../controllers/recipes.controller')

router.get('/random', [middleware.verify, middleware.checkRecipeUpdate], controller.getRandomRecipes)

router.get('/favorites', [middleware.verify], controller.getFavorites)

router.post('/favorites', [middleware.verify], controller.addFavorites)

module.exports = router
