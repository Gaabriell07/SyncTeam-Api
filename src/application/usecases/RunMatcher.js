const AvailabilityRepository = require('../../infrastructure/repositories/AvailabilityRepository')
const MatcherService = require('../../domain/services/MatcherService')

class RunMatcher {
  constructor() {
    this.availabilityRepository = new AvailabilityRepository()
    this.matcherService = new MatcherService()
  }

  async execute({ workspaceId, minScore = 0.5 }) {
    const availabilities = await this.availabilityRepository.findByWorkspace(workspaceId)

    if (availabilities.length === 0) {
      throw new Error('NO_AVAILABILITY_DATA')
    }

    const result = this.matcherService.findMatches(availabilities, minScore)
    return result
  }
}

module.exports = RunMatcher
