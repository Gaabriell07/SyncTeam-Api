class MatcherService {
  findMatches(availabilities, minScore = 0.5) {
    if (!availabilities || availabilities.length === 0) {
      return { completeMatches: [], partialMatches: [], totalMembers: 0 }
    }

    const totalMembers = availabilities.length
    const slotMap = new Map()

    for (const availability of availabilities) {
      for (const slot of availability.slots) {
        const key = `${slot.day}-${slot.start}-${slot.end}`

        if (!slotMap.has(key)) {
          slotMap.set(key, { slot, attendees: [], absentees: [] })
        }

        slotMap.get(key).attendees.push(availability.userId)
      }
    }

    const allUserIds = availabilities.map(a => a.userId)

    for (const [, value] of slotMap) {
      value.absentees = allUserIds.filter(id => !value.attendees.includes(id))
    }

    const results = []

    for (const [, value] of slotMap) {
      const score = value.attendees.length / totalMembers

      if (score < minScore) continue

      results.push({
        type: score === 1 ? 'complete' : 'partial',
        slot: value.slot,
        attendees: value.attendees,
        absentees: value.absentees,
        score: Math.round(score * 100) / 100
      })
    }

    const completeMatches = results
      .filter(r => r.type === 'complete')

    const partialMatches = results
      .filter(r => r.type === 'partial')
      .sort((a, b) => b.score - a.score)

    return { completeMatches, partialMatches, totalMembers }
  }
}

module.exports = MatcherService
