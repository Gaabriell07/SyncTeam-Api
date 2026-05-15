const TaskRepository = require('../../infrastructure/repositories/TaskRepository')

const VALID_STATUSES = ['TODO', 'IN_PROGRESS', 'DONE']

class UpdateTaskStatus {
  constructor() {
    this.taskRepository = new TaskRepository()
  }

  async execute({ id, status }) {
    if (!VALID_STATUSES.includes(status)) {
      throw new Error('INVALID_STATUS')
    }

    const task = await this.taskRepository.findById(id)
    if (!task) {
      throw new Error('TASK_NOT_FOUND')
    }

    return await this.taskRepository.updateStatus({ id, status })
  }
}

module.exports = UpdateTaskStatus
