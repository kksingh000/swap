import { listings, users } from '../data/seed'

// The signed-in demo persona: until real accounts own listings (step 6),
// "your closet" and "your requests" belong to Ananya (u-01).
export const DEMO_PERSONA_ID = 'u-01'

// Hydrate a stored request (ids only) into full listings + direction info.
export function resolveRequest(request) {
  const offered = listings.find((l) => l.id === request.offeredId)
  const requested = listings.find((l) => l.id === request.requestedId)
  const incoming = requested?.ownerId === DEMO_PERSONA_ID
  const counterpartId = incoming ? offered?.ownerId : requested?.ownerId
  const counterpart = users.find((u) => u.id === counterpartId) ?? users[1]
  return {
    ...request,
    offered,
    requested,
    incoming,
    counterpart,
    mine: incoming ? requested : offered,
    theirs: incoming ? offered : requested,
  }
}

export function formatClock(date = new Date()) {
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })
}
