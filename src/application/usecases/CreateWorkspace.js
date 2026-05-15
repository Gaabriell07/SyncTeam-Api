const { v4: uuidv4 } = require('uuid')
const WorkspaceRepository = require('../../infrastructure/repositories/WorkspaceRepository')

class CreateWorkspace {
  constructor() {
    this.workspaceRepository = new WorkspaceRepository()
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

    return workspace
  }
}

module.exports = CreateWorkspace
