class Availability {
  constructor({ id, userId, workspaceId, slots, updatedAt }) {
    this.id = id
    this.userId = userId
    this.workspaceId = workspaceId
    this.slots = slots
    this.updatedAt = updatedAt
  }
}

module.exports = Availability
