const WorkspaceRepository = require('../../infrastructure/repositories/WorkspaceRepository')

class UpdateMemberRole {
  constructor() {
    this.workspaceRepository = new WorkspaceRepository()
  }

  async execute({ workspaceId, userId, role }) {
    const member = await this.workspaceRepository.findMember({ workspaceId, userId })
    if (!member) {
      throw new Error('MEMBER_NOT_FOUND')
    }

    const updatedMember = await this.workspaceRepository.updateMemberRole({ workspaceId, userId, role })
    return updatedMember
  }
}

module.exports = UpdateMemberRole
