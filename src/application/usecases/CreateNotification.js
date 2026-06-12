const NotificationRepository = require('../../infrastructure/repositories/NotificationRepository')

class CreateNotification {
  constructor() {
    this.repo = new NotificationRepository()
  }

  /**
   * @param {object} params
   * @param {string} params.userId
   * @param {string} params.title
   * @param {string} params.message
   * @param {string} params.type  - TASK_STATUS_CHANGE | TASK_DUE_SOON | TASK_OVERDUE | GENERAL
   * @param {object} [params.metadata]
   */
  async execute({ userId, title, message, type, metadata }) {
    return this.repo.create({ userId, title, message, type, metadata })
  }
}

module.exports = CreateNotification
