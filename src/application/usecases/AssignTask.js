const TaskRepository = require('../../infrastructure/repositories/TaskRepository')
const UserRepository = require('../../infrastructure/repositories/UserRepository')
const WorkspaceRepository = require('../../infrastructure/repositories/WorkspaceRepository')
const emailService = require('../../infrastructure/services/EmailService')

class AssignTask {
  constructor() {
    this.taskRepository = new TaskRepository()
    this.userRepository = new UserRepository()
    this.workspaceRepository = new WorkspaceRepository()
  }

  async execute({ id, assigneeId, userId }) {
    const task = await this.taskRepository.findById(id)
    if (!task) {
      throw new Error('TASK_NOT_FOUND')
    }

    const member = await this.workspaceRepository.findMember({ workspaceId: task.workspaceId, userId })
    if (!member || member.role !== 'LEADER') {
      throw new Error('FORBIDDEN')
    }

    const updatedTask = await this.taskRepository.updateAssignee({ id, assigneeId })

    if (assigneeId) {
      // Send notification
      try {
        const user = await this.userRepository.findById(assigneeId)
        const workspace = await this.workspaceRepository.findById(task.workspaceId)
        if (user && workspace) {
          await emailService.sendTaskAssignedEmail(user.email, task.title, workspace.name, task.dueDate)
        }
      } catch (err) {
        console.error('Failed to send notification email:', err)
      }
    }

    return updatedTask
  }
}

module.exports = AssignTask
