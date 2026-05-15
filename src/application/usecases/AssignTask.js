const TaskRepository = require('../../infrastructure/repositories/TaskRepository')

class AssignTask {
  constructor() {
    this.taskRepository = new TaskRepository()
  }

  async execute({ id, assigneeId }) {
    const task = await this.taskRepository.findById(id)
    if (!task) {
      throw new Error('TASK_NOT_FOUND')
    }

    return await this.taskRepository.updateAssignee({ id, assigneeId })
  }
}

module.exports = AssignTask
