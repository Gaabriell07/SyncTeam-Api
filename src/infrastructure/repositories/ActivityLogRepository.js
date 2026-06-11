const prisma = require('../database/prismaClient')

class ActivityLogRepository {
  async create({ userId, action, details }) {
    const log = await prisma.activityLog.create({
      data: {
        userId,
        action,
        details: details ? details : null
      }
    })
    return log
  }

  async findByUserId(userId) {
    const logs = await prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50 // Limit to 50 most recent logs
    })
    return logs
  }
}

module.exports = ActivityLogRepository
