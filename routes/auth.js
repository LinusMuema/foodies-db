const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({storage: multer.diskStorage({})})
const middleware = require('../middleware')
const controller = require('../controllers/auth.controller')

router.post('/', controller.authenticate);

router.post('/upload', [upload.single('image'), middleware.verify],  controller.upload);

router.put('/update', middleware.verify, controller.update)

router.post('/register', controller.register);

router.put('/relay', middleware.verify , controller.updateUser)

module.exports = router;
