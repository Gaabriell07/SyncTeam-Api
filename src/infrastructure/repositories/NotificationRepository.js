const prisma = require('../database/prismaClient')

class NotificationRepository {
  async create({ userId, title, message, type, metadata }) {
    return prisma.notification.create({
      data: { userId, title, message, type, metadata: metadata ?? null }
    })
  }

  async findByUserId(userId) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    })
  }

  async countUnread(userId) {
    return prisma.notification.count({
      where: { userId, isRead: false }
    })
  }

  async markAllAsRead(userId) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    })
  }

  async clearAll(userId) {
    return prisma.notification.deleteMany({ where: { userId } })
  }
}

module.exports = NotificationRepository
