const TaskRepository = require('../../infrastructure/repositories/TaskRepository')

class GetWorkspaceTasks {
  constructor() {
    this.taskRepository = new TaskRepository()
  }

  async execute(workspaceId) {
    const tasks = await this.taskRepository.findByWorkspace(workspaceId)
    return tasks
  }
}

module.exports = GetWorkspaceTasks
