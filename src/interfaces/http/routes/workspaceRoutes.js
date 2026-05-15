const express = require('express')
const { createWorkspace, joinWorkspace, getWorkspace } = require('../controllers/workspaceController')

const router = express.Router()

router.post('/', createWorkspace)
router.post('/join', joinWorkspace)
router.get('/:id', getWorkspace)

module.exports = router
