const { v4: uuidv4 } = require('uuid')
const TaskRepository = require('../../infrastructure/repositories/TaskRepository')

class CreateTask {
  constructor() {
    this.taskRepository = new TaskRepository()
  }

  async execute({ title, description, workspaceId, assigneeId }) {
    if (!title || !workspaceId) {
      throw new Error('MISSING_REQUIRED_FIELDS')
    }

    const task = await this.taskRepository.create({
      id: uuidv4(),
      title,
      description,
      workspaceId,
      assigneeId: assigneeId || null
    })

    return task
  }
}

module.exports = CreateTask
