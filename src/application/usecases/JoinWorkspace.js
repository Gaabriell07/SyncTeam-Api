const WorkspaceRepository = require('../../infrastructure/repositories/WorkspaceRepository')
const LogActivity = require('./LogActivity')

class JoinWorkspace {
  constructor() {
    this.workspaceRepository = new WorkspaceRepository()
    this.logActivity = new LogActivity()
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

    await this.logActivity.execute({
      userId,
      action: 'UNIR_ESPACIO',
      details: `Te has unido al espacio de trabajo "${workspace.name}".`
    })

    return workspace
  }
}

module.exports = JoinWorkspace
