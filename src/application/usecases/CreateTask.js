const { v4: uuidv4 } = require('uuid')
const TaskRepository = require('../../infrastructure/repositories/TaskRepository')
const WorkspaceRepository = require('../../infrastructure/repositories/WorkspaceRepository')
const UserRepository = require('../../infrastructure/repositories/UserRepository')
const emailService = require('../../infrastructure/services/EmailService')
const LogActivity = require('./LogActivity')

class CreateTask {
  constructor() {
    this.taskRepository = new TaskRepository()
    this.workspaceRepository = new WorkspaceRepository()
    this.userRepository = new UserRepository()
    this.logActivity = new LogActivity()
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

    try {
      await this.logActivity.execute({
        userId,
        action: 'CREATED_TASK',
        details: { taskId: task.id, title: task.title, workspaceId }
      })
    } catch (err) {
      console.error('Failed to log activity:', err)
    }

    return task
  }
}

module.exports = CreateTask
