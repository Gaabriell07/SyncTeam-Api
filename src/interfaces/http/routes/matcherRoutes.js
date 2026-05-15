const express = require('express')
const { runMatcher } = require('../controllers/matcherController')

const router = express.Router()

router.get('/:workspaceId', runMatcher)

module.exports = router
