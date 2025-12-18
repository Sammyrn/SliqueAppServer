const express = require('express');
const router = express.Router();
const {login, register, registerAdmin, refresh, logout, authMe} = require('../controllers/authController.js')
const {validateRegister, validateLogin} = require('../middleware/validateMiddleware.js')


router.post('/login', validateLogin, login);
router.post('/register', validateRegister, register);
router.post('/registerAdmin', validateRegister, registerAdmin);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', authMe)


module.exports = router;