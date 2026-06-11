const CreateTask = require('../../../application/usecases/CreateTask')
const GetWorkspaceTasks = require('../../../application/usecases/GetWorkspaceTasks')
const UpdateTaskStatus = require('../../../application/usecases/UpdateTaskStatus')
const AssignTask = require('../../../application/usecases/AssignTask')

const createTask = async (req, res) => {
  try {
    const { title, description, workspaceId, assigneeId, dueDate } = req.body
    const userId = req.user.id

    if (!title || !workspaceId) {
      return res.status(400).json({ error: 'title and workspaceId are required' })
    }

    const usecase = new CreateTask()
    const task = await usecase.execute({ title, description, workspaceId, assigneeId, dueDate, userId })
    return res.status(201).json(task)
  } catch (error) {
    if (error.message === 'FORBIDDEN') return res.status(403).json({ error: 'Only LEADER can create tasks' })
    if (error.message === 'MISSING_REQUIRED_FIELDS') {
      return res.status(400).json({ error: 'title and workspaceId are required' })
    }
    return res.status(500).json({ error: 'Internal server error' })
  }
}

const getWorkspaceTasks = async (req, res) => {
  try {
    const { workspaceId } = req.params
    const usecase = new GetWorkspaceTasks()
    const tasks = await usecase.execute(workspaceId)
    return res.status(200).json(tasks)
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}

const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const userId = req.user.id

    if (!status) {
      return res.status(400).json({ error: 'status is required' })
    }

    const usecase = new UpdateTaskStatus()
    const task = await usecase.execute({ id, status, userId })
    return res.status(200).json(task)
  } catch (error) {
    if (error.message === 'FORBIDDEN') return res.status(403).json({ error: 'Only LEADER can close tasks' })
    if (error.message === 'INVALID_STATUS') {
      return res.status(400).json({ error: 'status must be TODO, IN_PROGRESS or DONE' })
    }
    if (error.message === 'TASK_NOT_FOUND') {
      return res.status(404).json({ error: 'Task not found' })
    }
    return res.status(500).json({ error: 'Internal server error' })
  }
}

const assignTask = async (req, res) => {
  try {
    const { id } = req.params
    const { assigneeId } = req.body
    const userId = req.user.id

    if (!assigneeId) {
      return res.status(400).json({ error: 'assigneeId is required' })
    }

    const usecase = new AssignTask()
    const task = await usecase.execute({ id, assigneeId, userId })
    return res.status(200).json(task)
  } catch (error) {
    if (error.message === 'FORBIDDEN') return res.status(403).json({ error: 'Only LEADER can assign tasks' })
    if (error.message === 'TASK_NOT_FOUND') {
      return res.status(404).json({ error: 'Task not found' })
    }
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { createTask, getWorkspaceTasks, updateTaskStatus, assignTask }
