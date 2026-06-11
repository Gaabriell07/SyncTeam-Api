const { v4: uuidv4 } = require('uuid')
const TaskRepository = require('../../infrastructure/repositories/TaskRepository')
const WorkspaceRepository = require('../../infrastructure/repositories/WorkspaceRepository')
const UserRepository = require('../../infrastructure/repositories/UserRepository')
const emailService = require('../../infrastructure/services/EmailService')

class CreateTask {
  constructor() {
    this.taskRepository = new TaskRepository()
    this.workspaceRepository = new WorkspaceRepository()
    this.userRepository = new UserRepository()
  }

  async execute({ title, description, workspaceId, assigneeId, dueDate, userId }) {
    if (!title || !workspaceId || !userId) {
      throw new Error('MISSING_REQUIRED_FIELDS')
    }

    const member = await this.workspaceRepository.findMember({ workspaceId, userId })
    if (!member || member.role !== 'LEADER') {
      throw new Error('FORBIDDEN')
    }

    const task = await this.taskRepository.create({
      id: uuidv4(),
      title,
      description,
      workspaceId,
      assigneeId: assigneeId || null,
      dueDate: dueDate ? new Date(dueDate) : null
    })

    if (assigneeId) {
      try {
        const user = await this.userRepository.findById(assigneeId)
        const workspace = await this.workspaceRepository.findById(workspaceId)
        if (user && workspace) {
          await emailService.sendTaskAssignedEmail(user.email, task.title, workspace.name, dueDate)
        }
      } catch (err) {
        console.error('Failed to send notification email on creation:', err)
      }
    }

    return task
  }
}

module.exports = CreateTask
