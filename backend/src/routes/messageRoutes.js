const express= require('express');
const protectRoute = require('../middlewares/auth');
const {getUserForSidebar, getMessages, sendMessage}= require('../controllers/messageController')

const router= express.Router();

router.get('/users', protectRoute, getUserForSidebar);
router.get('/:id', protectRoute, getMessages);
router.post('/send/:id', protectRoute, sendMessage)

module.exports= router;