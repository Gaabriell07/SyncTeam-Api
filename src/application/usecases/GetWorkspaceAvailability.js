const AvailabilityRepository = require('../../infrastructure/repositories/AvailabilityRepository')

class GetWorkspaceAvailability {
  constructor() {
    this.availabilityRepository = new AvailabilityRepository()
  }

  async execute(workspaceId) {
    const availabilities = await this.availabilityRepository.findByWorkspace(workspaceId)
    return availabilities
  }
}

module.exports = GetWorkspaceAvailability
