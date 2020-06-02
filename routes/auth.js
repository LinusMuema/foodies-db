const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller')

router.post('/login', controller.login);

router.get('/confirm', controller.confirm);

router.post('/confirmAccount', controller.confirmAccount);

router.get('/:email/reset', controller.resetEmail);

router.get('/reset/form', controller.resetForm);

router.post('/reset', controller.postReset);

module.exports = router;
