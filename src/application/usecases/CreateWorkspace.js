const { v4: uuidv4 } = require('uuid')
const WorkspaceRepository = require('../../infrastructure/repositories/WorkspaceRepository')
const LogActivity = require('./LogActivity')

class CreateWorkspace {
  constructor() {
    this.workspaceRepository = new WorkspaceRepository()
    this.logActivity = new LogActivity()
  }

  async execute({ name, userId }) {
    const workspace = await this.workspaceRepository.create({
      id: uuidv4(),
      name,
      inviteCode: uuidv4()
    })

    await this.workspaceRepository.addMember({
      workspaceId: workspace.id,
      userId,
      role: 'LEADER'
    })

    try {
      await this.logActivity.execute({
        userId,
        action: 'CREAR_ESPACIO',
        details: { message: `Has creado el espacio de trabajo "${name}".` }
      })
    } catch (logError) {
      console.error('Error al registrar la actividad:', logError)
    }

    return workspace
  }
}

module.exports = CreateWorkspace
