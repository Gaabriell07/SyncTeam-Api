const express = require('express')
const { createTask, getWorkspaceTasks, updateTaskStatus, assignTask } = require('../controllers/taskController')

const router = express.Router()

router.post('/', createTask)
router.get('/:workspaceId', getWorkspaceTasks)
router.patch('/:id/status', updateTaskStatus)
router.patch('/:id/assign', assignTask)

module.exports = router
