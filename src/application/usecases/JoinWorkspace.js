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
      if (existing.isActive) {
        throw new Error('ALREADY_A_MEMBER')
      } else {
        await this.workspaceRepository.updateMemberStatus({
          workspaceId: workspace.id,
          userId,
          isActive: true
        })
        await this.workspaceRepository.updateMemberRole({
          workspaceId: workspace.id,
          userId,
          role: role || 'MEMBER'
        })
      }
    } else {
      await this.workspaceRepository.addMember({
        workspaceId: workspace.id,
        userId,
        role: role || 'MEMBER'
      })
    }

    try {
      await this.logActivity.execute({
        userId,
        action: 'UNIR_ESPACIO',
        details: { message: `Te has unido al espacio de trabajo "${workspace.name}".` }
      })
    } catch (logError) {
      console.error('Error al registrar la actividad:', logError)
    }

    return workspace
  }
}

module.exports = JoinWorkspace
