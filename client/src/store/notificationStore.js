import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { notificationsSeed } from '../data/seed'

// Notification feed for the signed-in persona. Seeded on first load; session
// events (swap requests, accept/decline, reviews) push new entries on top.
export const useNotificationStore = create(
  persist(
    (set) => ({
      notifications: notificationsSeed,
      push: ({ type = 'info', text, to }) =>
        set((s) => ({
          notifications: [
            {
              id: `nt-${Date.now().toString(36)}`,
              type,
              text,
              to,
              createdAt: new Date().toISOString(),
              read: false,
            },
            ...s.notifications,
          ],
        })),
      markRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      markAllRead: () =>
        set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
      clear: () => set({ notifications: [] }),
    }),
    {
      name: 'swap-notifications',
      // Keep session-created notifications; re-add any seed items the user
      // hasn't seen, so a fresh demo always has a populated feed.
      merge: (persisted, current) => {
        const stored = persisted?.notifications ?? []
        const missingSeed = notificationsSeed.filter((seed) => !stored.some((n) => n.id === seed.id))
        return {
          ...current,
          ...(persisted ?? {}),
          notifications: [...stored, ...missingSeed].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          ),
        }
      },
    },
  ),
)

// Derived unread count — a selector so components re-render only on change.
export const unreadSelector = (s) => s.notifications.filter((n) => !n.read).length
