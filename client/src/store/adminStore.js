import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Admin moderation state — suspensions, removals, dispute resolutions.
// Persisted locally; the Express admin API takes over in step 6's backend.
export const useAdminStore = create(
  persist(
    (set) => ({
      suspendedUserIds: [],
      removedListingIds: [],
      resolvedDisputes: {}, // dispute id → resolution note
      toggleUserSuspended: (id) =>
        set((s) => ({
          suspendedUserIds: s.suspendedUserIds.includes(id)
            ? s.suspendedUserIds.filter((x) => x !== id)
            : [...s.suspendedUserIds, id],
        })),
      toggleListingRemoved: (id) =>
        set((s) => ({
          removedListingIds: s.removedListingIds.includes(id)
            ? s.removedListingIds.filter((x) => x !== id)
            : [...s.removedListingIds, id],
        })),
      resolveDispute: (id, resolution) =>
        set((s) => ({ resolvedDisputes: { ...s.resolvedDisputes, [id]: resolution } })),
    }),
    { name: 'swap-admin' },
  ),
)
