class Task {
  constructor({ id, title, description, status, workspaceId, assigneeId, dueDate, createdAt }) {
    this.id = id
    this.title = title
    this.description = description
    this.status = status
    this.workspaceId = workspaceId
    this.assigneeId = assigneeId
    this.dueDate = dueDate
    this.createdAt = createdAt
  }
}

module.exports = Task
