const NotificationRepository = require('../../infrastructure/repositories/NotificationRepository')

class GetNotifications {
  constructor() {
    this.repo = new NotificationRepository()
  }

  async execute(userId) {
    const notifications = await this.repo.findByUserId(userId)
    const unreadCount = await this.repo.countUnread(userId)
    return { notifications, unreadCount }
  }
}

module.exports = GetNotifications
