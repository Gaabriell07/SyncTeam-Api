const CreateTask = require('../../../application/usecases/CreateTask')
const GetWorkspaceTasks = require('../../../application/usecases/GetWorkspaceTasks')
const UpdateTaskStatus = require('../../../application/usecases/UpdateTaskStatus')
const AssignTask = require('../../../application/usecases/AssignTask')
const EditTask = require('../../../application/usecases/EditTask')
const DeleteTask = require('../../../application/usecases/DeleteTask')

const createTask = async (req, res) => {
  try {
    const { title, description, workspaceId, assigneeId, dueDate } = req.body
    const userId = req.user.id

    if (!title || !workspaceId) {
      return res.status(400).json({ error: 'title and workspaceId are required' })
    }

    const usecase = new CreateTask()
    const task = await usecase.execute({ title, description, workspaceId, assigneeId, dueDate, userId })
    
    // Emit task created event
    const io = req.app.get('io')
    if (io) io.to(workspaceId).emit('taskCreated', task)
    
    return res.status(201).json(task)
  } catch (error) {
    if (error.message === 'FORBIDDEN') return res.status(403).json({ error: 'Only LEADER can create tasks' })
    if (error.message === 'MISSING_REQUIRED_FIELDS') {
      return res.status(400).json({ error: 'title and workspaceId are required' })
    }
    console.error('TASK_CREATION_ERROR:', error); return res.status(500).json({ error: 'Internal server error', details: error.message })
  }
}

const getWorkspaceTasks = async (req, res) => {
  try {
    const { workspaceId } = req.params
    const usecase = new GetWorkspaceTasks()
    const tasks = await usecase.execute(workspaceId)
    return res.status(200).json(tasks)
  } catch (error) {
    console.error('TASK_CREATION_ERROR:', error); return res.status(500).json({ error: 'Internal server error', details: error.message })
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

    const io = req.app.get('io')
    const usecase = new UpdateTaskStatus(io)
    const task = await usecase.execute({ id, status, userId })
    
    // Emit task updated event to workspace room
    if (io) io.to(task.workspaceId).emit('taskUpdated', task)
    
    return res.status(200).json(task)
  } catch (error) {
    if (error.message === 'FORBIDDEN') return res.status(403).json({ error: 'No tienes permiso para cambiar el estado' })
    if (error.message === 'INVALID_STATUS') {
      return res.status(400).json({ error: 'status must be TODO, IN_PROGRESS or DONE' })
    }
    if (error.message === 'TASK_NOT_FOUND') {
      return res.status(404).json({ error: 'Task not found' })
    }
    console.error('TASK_STATUS_ERROR:', error); return res.status(500).json({ error: 'Internal server error', details: error.message })
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
    
    // Emit task updated event
    const io = req.app.get('io')
    if (io) io.to(task.workspaceId).emit('taskUpdated', task)
    
    return res.status(200).json(task)
  } catch (error) {
    if (error.message === 'FORBIDDEN') return res.status(403).json({ error: 'Only LEADER can assign tasks' })
    if (error.message === 'TASK_NOT_FOUND') {
      return res.status(404).json({ error: 'Task not found' })
    }
    console.error('TASK_CREATION_ERROR:', error); return res.status(500).json({ error: 'Internal server error', details: error.message })
  }
}

const editTask = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, dueDate } = req.body
    const userId = req.user.id

    const usecase = new EditTask()
    const task = await usecase.execute({ id, title, description, dueDate, userId })
    
    // Emit task updated event
    const io = req.app.get('io')
    if (io) io.to(task.workspaceId).emit('taskEdited', task)
    
    return res.status(200).json(task)
  } catch (error) {
    if (error.message === 'FORBIDDEN') return res.status(403).json({ error: 'Only LEADER or ASSIGNEE can edit tasks' })
    if (error.message === 'TASK_NOT_FOUND') {
      return res.status(404).json({ error: 'Task not found' })
    }
    console.error('TASK_EDIT_ERROR:', error); return res.status(500).json({ error: 'Internal server error', details: error.message })
  }
}

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const usecase = new DeleteTask()
    const result = await usecase.execute({ id, userId })
    
    // Emit task deleted event
    const io = req.app.get('io')
    if (io) io.to(result.workspaceId).emit('taskDeleted', result)
    
    return res.status(200).json({ message: 'Task deleted successfully' })
  } catch (error) {
    if (error.message === 'FORBIDDEN') return res.status(403).json({ error: 'Only LEADER or ASSIGNEE can delete tasks' })
    if (error.message === 'TASK_NOT_FOUND') {
      return res.status(404).json({ error: 'Task not found' })
    }
    console.error('TASK_DELETE_ERROR:', error); return res.status(500).json({ error: 'Internal server error', details: error.message })
  }
}

module.exports = { createTask, getWorkspaceTasks, updateTaskStatus, assignTask, editTask, deleteTask }
