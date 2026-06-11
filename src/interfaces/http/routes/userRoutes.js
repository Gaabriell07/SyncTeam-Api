const express = require('express')
const { registerUser, loginUser, getUser, updateProfile, getActivity } = require('../controllers/userController')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/:id', getUser)
router.put('/profile', authMiddleware, updateProfile)
router.get('/:id/activity', authMiddleware, getActivity)

module.exports = router
