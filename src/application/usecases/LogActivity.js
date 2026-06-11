const ActivityLogRepository = require('../../infrastructure/repositories/ActivityLogRepository')

class LogActivity {
  constructor() {
    this.activityLogRepository = new ActivityLogRepository()
  }

  async execute({ userId, action, details }) {
    if (!userId || !action) {
      throw new Error('MISSING_REQUIRED_FIELDS')
    }

    const log = await this.activityLogRepository.create({ userId, action, details })
    return log
  }
}

module.exports = LogActivity
