const prisma = require('../database/prismaClient')
const Workspace = require('../../domain/entities/Workspace')

class WorkspaceRepository {
  async create({ id, name, inviteCode }) {
    const workspace = await prisma.workspace.create({
      data: { id, name, inviteCode }
    })
    return new Workspace(workspace)
  }

  async findById(id) {
    const workspace = await prisma.workspace.findUnique({
      where: { id },
      include: { members: { include: { user: true } } }
    })
    return workspace ? new Workspace(workspace) : null
  }

  async findByInviteCode(inviteCode) {
    const workspace = await prisma.workspace.findUnique({
      where: { inviteCode },
      include: { members: { include: { user: true } } }
    })
    return workspace ? workspace : null
  }

  async addMember({ workspaceId, userId, role }) {
    return prisma.workspaceMember.create({
      data: { workspaceId, userId, role }
    })
  }

  async findMember({ workspaceId, userId }) {
    return prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId, workspaceId } }
    })
  }
}

module.exports = WorkspaceRepository
