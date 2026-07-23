import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Saved / wishlisted listings — just the ids, resolved against the catalogue
// (and the user's own drafts) where they're rendered. Persists across reloads.
export const useWishlistStore = create(
  persist(
    (set, get) => ({
      savedIds: [],
      isSaved: (id) => get().savedIds.includes(id),
      toggle: (id) =>
        set((s) => ({
          savedIds: s.savedIds.includes(id)
            ? s.savedIds.filter((x) => x !== id)
            : [id, ...s.savedIds],
        })),
      clear: () => set({ savedIds: [] }),
    }),
    { name: 'swap-wishlist' },
  ),
)
