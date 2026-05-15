const prisma = require('../database/prismaClient')
const Availability = require('../../domain/entities/Availability')

class AvailabilityRepository {
  async upsert({ userId, workspaceId, slots }) {
    const availability = await prisma.availability.upsert({
      where: { userId_workspaceId: { userId, workspaceId } },
      update: { slots },
      create: { userId, workspaceId, slots }
    })
    return new Availability(availability)
  }

  async findByWorkspace(workspaceId) {
    const records = await prisma.availability.findMany({
      where: { workspaceId },
      include: { user: true }
    })
    return records.map(r => new Availability(r))
  }

  async findByUserAndWorkspace({ userId, workspaceId }) {
    const record = await prisma.availability.findUnique({
      where: { userId_workspaceId: { userId, workspaceId } }
    })
    return record ? new Availability(record) : null
  }
}

module.exports = AvailabilityRepository
