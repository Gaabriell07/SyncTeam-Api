const WorkspaceRepository = require('../../infrastructure/repositories/WorkspaceRepository')

class ToggleMemberStatus {
  constructor() {
    this.workspaceRepository = new WorkspaceRepository()
  }

  async execute({ workspaceId, userId, isActive }) {
    const member = await this.workspaceRepository.findMember({ workspaceId, userId })
    if (!member) {
      throw new Error('MEMBER_NOT_FOUND')
    }

    const updatedMember = await this.workspaceRepository.updateMemberStatus({ workspaceId, userId, isActive })
    return updatedMember
  }
}

module.exports = ToggleMemberStatus
