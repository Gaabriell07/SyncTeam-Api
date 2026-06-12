const express = require('express')
const { createTask, getWorkspaceTasks, updateTaskStatus, assignTask, editTask, deleteTask } = require('../controllers/taskController')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/', authMiddleware, createTask)
router.get('/:workspaceId', authMiddleware, getWorkspaceTasks)
router.patch('/:id/status', authMiddleware, updateTaskStatus)
router.patch('/:id/assign', authMiddleware, assignTask)
router.put('/:id', authMiddleware, editTask)
router.delete('/:id', authMiddleware, deleteTask)

module.exports = router
