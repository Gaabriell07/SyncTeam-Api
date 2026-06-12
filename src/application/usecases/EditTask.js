const TaskRepository = require('../../infrastructure/repositories/TaskRepository')
const WorkspaceRepository = require('../../infrastructure/repositories/WorkspaceRepository')

class EditTask {
  constructor() {
    this.taskRepository = new TaskRepository()
    this.workspaceRepository = new WorkspaceRepository()
  }

  async execute({ id, title, description, dueDate, userId }) {
    const task = await this.taskRepository.findById(id)
    if (!task) {
      throw new Error('TASK_NOT_FOUND')
    }

    const member = await this.workspaceRepository.findMember({ workspaceId: task.workspaceId, userId })
    if (!member) {
      throw new Error('FORBIDDEN')
    }

    // Allow any member to edit the task

    return await this.taskRepository.update({
      id,
      title: title !== undefined ? title : task.title,
      description: description !== undefined ? description : task.description,
      dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : task.dueDate
    })
  }
}

module.exports = EditTask
