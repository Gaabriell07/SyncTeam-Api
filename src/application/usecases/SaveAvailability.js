const AvailabilityRepository = require('../../infrastructure/repositories/AvailabilityRepository')

class SaveAvailability {
  constructor() {
    this.availabilityRepository = new AvailabilityRepository()
  }

  async execute({ userId, workspaceId, slots }) {
    if (!Array.isArray(slots) || slots.length === 0) {
      throw new Error('INVALID_SLOTS')
    }

    const availability = await this.availabilityRepository.upsert({
      userId,
      workspaceId,
      slots
    })

    return availability
  }
}

module.exports = SaveAvailability
