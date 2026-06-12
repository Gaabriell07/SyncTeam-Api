const express = require('express')
const { createWorkspace, joinWorkspace, getWorkspace, toggleMemberStatus, updateMemberRole, deleteWorkspace } = require('../controllers/workspaceController')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/', createWorkspace)
router.post('/join', joinWorkspace)
router.get('/:id', getWorkspace)
router.patch('/:id/members/:userId/status', toggleMemberStatus)
router.patch('/:id/members/:userId/role', updateMemberRole)
router.delete('/:id', authMiddleware, deleteWorkspace)

module.exports = router
