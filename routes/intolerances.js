const express = require('express');
const router = express.Router();
const middleware = require('../middleware')
const controller = require('../controllers/intolerances.controller')

router.get('/', controller.getAllIntolerances)

router.post('/', middleware.verify, controller.updateIntolerances)

module.exports = router
