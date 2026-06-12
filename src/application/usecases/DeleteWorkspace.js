const WorkspaceRepository = require('../../infrastructure/repositories/WorkspaceRepository')
const LogActivity = require('./LogActivity')

class DeleteWorkspace {
  constructor() {
    this.workspaceRepository = new WorkspaceRepository()
    this.logActivity = new LogActivity()
  }

  async execute({ workspaceId, userId }) {
    const workspace = await this.workspaceRepository.findById(workspaceId)
    if (!workspace) throw new Error('WORKSPACE_NOT_FOUND')
    
    const member = workspace.members.find(m => m.userId === userId)
    if (!member || member.role !== 'LEADER') {
      throw new Error('UNAUTHORIZED')
    }

    await this.workspaceRepository.deleteWorkspace(workspaceId)

    try {
      await this.logActivity.execute({
        userId,
        action: 'ELIMINAR_ESPACIO',
        details: { message: `Has eliminado el espacio de trabajo "${workspace.name}".` }
      })
    } catch (logError) {
      console.error('Error al registrar la actividad:', logError)
    }

    return true
  }
}

module.exports = DeleteWorkspace
