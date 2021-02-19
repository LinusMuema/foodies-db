const express = require('express');
const router = express.Router();
const middleware = require('../middleware')
const controller = require('../controllers/auth.controller')

router.post('/register', controller.register);

router.put('/relay', middleware.verify , controller.updateUser)

module.exports = router;
