const express = require('express')
const router = express.Router()
const middleware = require('../middleware')
const controller = require('../controllers/recipes.controller')

router.get('/random', middleware.verify, controller.getRandomRecipes)

module.exports = router
