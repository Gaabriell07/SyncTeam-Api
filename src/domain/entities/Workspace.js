class Workspace {
  constructor({ id, name, inviteCode, createdAt, members }) {
    this.id = id
    this.name = name
    this.inviteCode = inviteCode
    this.createdAt = createdAt
    if (members) {
      this.members = members
    }
  }
}

module.exports = Workspace
