import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { reviewsSeed } from '../data/seed'

// Reviews keyed by the reviewed user's id. Seeded from the catalogue and
// appended to when the persona rates a completed swap.
export const useReviewStore = create(
  persist(
    (set, get) => ({
      reviews: reviewsSeed,
      forUser: (userId) => get().reviews[userId] ?? [],
      addReview: (userId, { rating, text, requestId, byId = 'u-01', byName = 'You' }) =>
        set((s) => {
          const review = {
            id: `rv-${Date.now().toString(36)}`,
            byId,
            byName,
            rating,
            text: text.trim(),
            requestId,
            date: new Date().toISOString().slice(0, 10),
          }
          return { reviews: { ...s.reviews, [userId]: [review, ...(s.reviews[userId] ?? [])] } }
        }),
    }),
    {
      name: 'swap-reviews',
      // Union seed reviews with stored ones so seeded content is never lost,
      // while user-added reviews (which have no seed id) are preserved.
      merge: (persisted, current) => {
        const stored = persisted?.reviews ?? {}
        const merged = { ...reviewsSeed }
        for (const [userId, list] of Object.entries(stored)) {
          const seedIds = new Set((reviewsSeed[userId] ?? []).map((r) => r.id))
          const extra = list.filter((r) => !seedIds.has(r.id))
          merged[userId] = [...extra, ...(reviewsSeed[userId] ?? [])]
        }
        return { ...current, ...(persisted ?? {}), reviews: merged }
      },
    },
  ),
)

export function averageRating(list) {
  if (!list?.length) return null
  return list.reduce((sum, r) => sum + r.rating, 0) / list.length
}
