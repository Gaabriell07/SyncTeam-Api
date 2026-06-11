const WorkspaceRepository = require('../../infrastructure/repositories/WorkspaceRepository')

class JoinWorkspace {
  constructor() {
    this.workspaceRepository = new WorkspaceRepository()
  }

  async execute({ inviteCode, userId, role }) {
    const workspace = await this.workspaceRepository.findByInviteCode(inviteCode)
    if (!workspace) {
      throw new Error('WORKSPACE_NOT_FOUND')
    }

    const existing = await this.workspaceRepository.findMember({
      workspaceId: workspace.id,
      userId
    })
    if (existing) {
      throw new Error('ALREADY_A_MEMBER')
    }

    await this.workspaceRepository.addMember({
      workspaceId: workspace.id,
      userId,
      role: role || 'Miembro'
    })

    return workspace
  }
}

module.exports = JoinWorkspace
