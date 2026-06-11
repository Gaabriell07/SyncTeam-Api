const TaskRepository = require('../../infrastructure/repositories/TaskRepository')
const WorkspaceRepository = require('../../infrastructure/repositories/WorkspaceRepository')

const VALID_STATUSES = ['TODO', 'IN_PROGRESS', 'DONE']

class UpdateTaskStatus {
  constructor() {
    this.taskRepository = new TaskRepository()
    this.workspaceRepository = new WorkspaceRepository()
  }

  async execute({ id, status, userId }) {
    if (!VALID_STATUSES.includes(status)) {
      throw new Error('INVALID_STATUS')
    }

    const task = await this.taskRepository.findById(id)
    if (!task) {
      throw new Error('TASK_NOT_FOUND')
    }

    const member = await this.workspaceRepository.findMember({ workspaceId: task.workspaceId, userId })
    if (!member) {
      throw new Error('FORBIDDEN')
    }

    if (status === 'DONE' && member.role !== 'LEADER') {
      throw new Error('FORBIDDEN')
    }

    return await this.taskRepository.updateStatus({ id, status })
  }
}

module.exports = UpdateTaskStatus
