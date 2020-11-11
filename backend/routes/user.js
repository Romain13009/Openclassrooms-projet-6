//routes de la partie user

const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

//Routes post car le frontend va envoyer des informations (email, password)
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;