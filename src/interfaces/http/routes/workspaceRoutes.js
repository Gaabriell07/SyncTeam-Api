const express = require('express')
const { createWorkspace, joinWorkspace, getWorkspace, toggleMemberStatus, updateMemberRole } = require('../controllers/workspaceController')

const router = express.Router()

router.post('/', createWorkspace)
router.post('/join', joinWorkspace)
router.get('/:id', getWorkspace)
router.patch('/:id/members/:userId/status', toggleMemberStatus)
router.patch('/:id/members/:userId/role', updateMemberRole)

module.exports = router
