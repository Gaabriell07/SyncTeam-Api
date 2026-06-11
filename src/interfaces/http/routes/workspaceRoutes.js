const express = require('express')
const { createWorkspace, joinWorkspace, getWorkspace, toggleMemberStatus } = require('../controllers/workspaceController')

const router = express.Router()

router.post('/', createWorkspace)
router.post('/join', joinWorkspace)
router.get('/:id', getWorkspace)
router.patch('/:id/members/:userId/status', toggleMemberStatus)

module.exports = router
