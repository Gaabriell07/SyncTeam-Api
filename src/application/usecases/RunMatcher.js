const AvailabilityRepository = require('../../infrastructure/repositories/AvailabilityRepository')
const WorkspaceRepository = require('../../infrastructure/repositories/WorkspaceRepository')
const MatcherService = require('../../domain/services/MatcherService')

class RunMatcher {
  constructor() {
    this.availabilityRepository = new AvailabilityRepository()
    this.workspaceRepository = new WorkspaceRepository()
    this.matcherService = new MatcherService()
  }

  async execute({ workspaceId, minScore = 0.5 }) {
    const allAvailabilities = await this.availabilityRepository.findByWorkspace(workspaceId)
    
    // Fetch members to check active status
    const workspace = await this.workspaceRepository.findById(workspaceId)
    const activeMemberIds = workspace.members.filter(m => m.isActive).map(m => m.userId)

    const availabilities = allAvailabilities.filter(a => activeMemberIds.includes(a.userId))

    if (availabilities.length === 0) {
      throw new Error('NO_AVAILABILITY_DATA')
    }

    const result = this.matcherService.findMatches(availabilities, minScore)
    return result
  }
}

module.exports = RunMatcher
