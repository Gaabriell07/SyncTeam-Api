const WorkspaceRepository = require('../../infrastructure/repositories/WorkspaceRepository')

class GetWorkspace {
  constructor() {
    this.workspaceRepository = new WorkspaceRepository()
  }

  async execute(id) {
    const workspace = await this.workspaceRepository.findById(id)
    if (!workspace) {
      throw new Error('WORKSPACE_NOT_FOUND')
    }
    return workspace
  }
}

module.exports = GetWorkspace
