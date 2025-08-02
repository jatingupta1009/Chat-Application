const express= require('express');
const {signup, login, logout, updateProfile, checkAuth}= require('../controllers/authController')
const router= express.Router();
const protectRoute= require('../middlewares/auth')


//route.post(route, controller)

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)

router.put('/update-profile', protectRoute, updateProfile);

router.get('/check', protectRoute, checkAuth)

module.exports= router;