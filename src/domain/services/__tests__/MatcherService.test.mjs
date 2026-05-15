import { describe, it, expect } from 'vitest'
import MatcherService from '../MatcherService.js'

const matcher = new MatcherService()

describe('MatcherService', () => {

  it('devuelve vacío si no hay disponibilidades', () => {
    const result = matcher.findMatches([])
    expect(result.completeMatches).toHaveLength(0)
    expect(result.partialMatches).toHaveLength(0)
    expect(result.totalMembers).toBe(0)
  })

  it('encuentra coincidencia completa cuando todos coinciden', () => {
    const availabilities = [
      { userId: 'user1', slots: [{ day: 'LUN', start: '10:00', end: '11:00' }] },
      { userId: 'user2', slots: [{ day: 'LUN', start: '10:00', end: '11:00' }] },
      { userId: 'user3', slots: [{ day: 'LUN', start: '10:00', end: '11:00' }] }
    ]

    const result = matcher.findMatches(availabilities)
    expect(result.completeMatches).toHaveLength(1)
    expect(result.completeMatches[0].score).toBe(1)
    expect(result.completeMatches[0].absentees).toHaveLength(0)
  })

  it('encuentra coincidencia parcial cuando no todos coinciden', () => {
    const availabilities = [
      { userId: 'user1', slots: [{ day: 'MAR', start: '14:00', end: '15:00' }] },
      { userId: 'user2', slots: [{ day: 'MAR', start: '14:00', end: '15:00' }] },
      { userId: 'user3', slots: [{ day: 'MIE', start: '09:00', end: '10:00' }] }
    ]

    const result = matcher.findMatches(availabilities)
    expect(result.completeMatches).toHaveLength(0)
    expect(result.partialMatches).toHaveLength(1)
    expect(result.partialMatches[0].attendees).toContain('user1')
    expect(result.partialMatches[0].attendees).toContain('user2')
    expect(result.partialMatches[0].absentees).toContain('user3')
  })

  it('ordena parciales por score descendente', () => {
    const availabilities = [
      { userId: 'user1', slots: [{ day: 'LUN', start: '10:00', end: '11:00' }, { day: 'MAR', start: '14:00', end: '15:00' }] },
      { userId: 'user2', slots: [{ day: 'LUN', start: '10:00', end: '11:00' }, { day: 'MAR', start: '14:00', end: '15:00' }] },
      { userId: 'user3', slots: [{ day: 'LUN', start: '10:00', end: '11:00' }] },
      { userId: 'user4', slots: [{ day: 'MAR', start: '14:00', end: '15:00' }] }
    ]

    const result = matcher.findMatches(availabilities)
    expect(result.completeMatches).toHaveLength(0)
    expect(result.partialMatches[0].score).toBeGreaterThanOrEqual(result.partialMatches[1].score)
  })

  it('descarta bloques por debajo del minScore', () => {
    const availabilities = [
      { userId: 'user1', slots: [{ day: 'VIE', start: '08:00', end: '09:00' }] },
      { userId: 'user2', slots: [] },
      { userId: 'user3', slots: [] },
      { userId: 'user4', slots: [] }
    ]

    const result = matcher.findMatches(availabilities, 0.5)
    expect(result.completeMatches).toHaveLength(0)
    expect(result.partialMatches).toHaveLength(0)
  })

})
