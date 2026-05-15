class Task {
  constructor({ id, title, description, status, workspaceId, assigneeId, createdAt }) {
    this.id = id
    this.title = title
    this.description = description
    this.status = status
    this.workspaceId = workspaceId
    this.assigneeId = assigneeId
    this.createdAt = createdAt
  }
}

module.exports = Task
