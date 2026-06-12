const TaskRepository = require('../../infrastructure/repositories/TaskRepository')
const WorkspaceRepository = require('../../infrastructure/repositories/WorkspaceRepository')

class DeleteTask {
  constructor() {
    this.taskRepository = new TaskRepository()
    this.workspaceRepository = new WorkspaceRepository()
  }

  async execute({ id, userId }) {
    const task = await this.taskRepository.findById(id)
    if (!task) {
      throw new Error('TASK_NOT_FOUND')
    }

    const member = await this.workspaceRepository.findMember({ workspaceId: task.workspaceId, userId })
    if (!member) {
      throw new Error('FORBIDDEN')
    }

    // Allow any member to delete the task

    await this.taskRepository.delete(id)
    return { id, workspaceId: task.workspaceId }
  }
}

module.exports = DeleteTask
