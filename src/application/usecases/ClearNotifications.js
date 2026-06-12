const NotificationRepository = require('../../infrastructure/repositories/NotificationRepository')

class ClearNotifications {
  constructor() {
    this.repo = new NotificationRepository()
  }

  async markAllRead(userId) {
    await this.repo.markAllAsRead(userId)
  }

  async clearAll(userId) {
    await this.repo.clearAll(userId)
  }
}

module.exports = ClearNotifications
