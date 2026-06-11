const ActivityLogRepository = require('../../infrastructure/repositories/ActivityLogRepository')

class GetUserActivity {
  constructor() {
    this.activityLogRepository = new ActivityLogRepository()
  }

  async execute(userId) {
    if (!userId) throw new Error('USER_ID_REQUIRED')
    
    const logs = await this.activityLogRepository.findByUserId(userId)
    return logs
  }
}

module.exports = GetUserActivity
