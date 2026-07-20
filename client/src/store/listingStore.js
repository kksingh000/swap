import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { estimateValue } from '../lib/swapValue'

// Listings the signed-in user creates from the dashboard uploader.
// Object-URL images don't survive reloads (they fall back to the editorial
// placeholder frame); real uploads arrive with the API in step 6.
export const useListingStore = create(
  persist(
    (set) => ({
      userListings: [],
      addListing: (draft) => {
        const listing = {
          id: `ul-${Date.now().toString(36)}`,
          itemId: `SW-${1600 + Math.floor(Math.random() * 300)}`,
          status: 'available',
          listedAt: new Date().toISOString().slice(0, 10),
          ...draft,
          swapValue: estimateValue(draft),
        }
        set((s) => ({ userListings: [listing, ...s.userListings] }))
        return listing
      },
      removeListing: (id) =>
        set((s) => ({ userListings: s.userListings.filter((l) => l.id !== id) })),
    }),
    {
      name: 'swap-user-listings',
      // Object URLs are session-scoped; drop them on rehydrate.
      merge: (persisted, current) => ({
        ...current,
        ...(persisted ?? {}),
        userListings: (persisted?.userListings ?? []).map((l) => ({
          ...l,
          image: l.image?.startsWith('blob:') ? null : l.image,
        })),
      }),
    },
  ),
)
