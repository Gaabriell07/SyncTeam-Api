const prisma = require('../database/prismaClient')
const Task = require('../../domain/entities/Task')

class TaskRepository {
  async create({ id, title, description, workspaceId, assigneeId }) {
    const task = await prisma.task.create({
      data: { id, title, description, workspaceId, assigneeId }
    })
    return new Task(task)
  }

  async findByWorkspace(workspaceId) {
    const tasks = await prisma.task.findMany({
      where: { workspaceId },
      include: { assignee: true },
      orderBy: { createdAt: 'desc' }
    })
    return tasks.map(t => new Task(t))
  }

  async findById(id) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: { assignee: true }
    })
    return task ? new Task(task) : null
  }

  async updateStatus({ id, status }) {
    const task = await prisma.task.update({
      where: { id },
      data: { status }
    })
    return new Task(task)
  }

  async updateAssignee({ id, assigneeId }) {
    const task = await prisma.task.update({
      where: { id },
      data: { assigneeId }
    })
    return new Task(task)
  }
}

module.exports = TaskRepository
