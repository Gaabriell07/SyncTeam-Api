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

    const completeMatches = this._mergeMatches(results.filter(r => r.type === 'complete'))

    const partialMatches = this._mergeMatches(results.filter(r => r.type === 'partial'))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)

    return { completeMatches, partialMatches, totalMembers }
  }

  _mergeMatches(matches) {
    if (matches.length === 0) return []

    const byDay = {}
    for (const match of matches) {
      if (!byDay[match.slot.day]) byDay[match.slot.day] = []
      byDay[match.slot.day].push(match)
    }

    const merged = []

    for (const day in byDay) {
      const dayMatches = byDay[day].sort((a, b) => a.slot.start.localeCompare(b.slot.start))

      let current = dayMatches[0]

      for (let i = 1; i < dayMatches.length; i++) {
        const next = dayMatches[i]
        
        const sameAttendees = current.attendees.length === next.attendees.length && 
                              current.attendees.every(id => next.attendees.includes(id))

        if (current.slot.end === next.slot.start && sameAttendees) {
          current = {
            ...current,
            slot: {
              ...current.slot,
              end: next.slot.end
            }
          }
        } else {
          merged.push(current)
          current = next
        }
      }
      merged.push(current)
    }

    return merged
  }
}

module.exports = MatcherService
