const express = require('express')
const router = express.Router()
const middleware = require('../middleware')
const controller = require('../controllers/recipes.controller')

router.get('/random', [middleware.verify, middleware.checkUpdate], controller.getRandomRecipes)

router.get('/:id/instructions', middleware.verify, controller.getRecipeById)

module.exports = router
