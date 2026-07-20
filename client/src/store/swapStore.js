import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Pre-seeded negotiations so the flow is demoable on first visit. Stored
// edits to these (status changes, new messages) persist across reloads;
// the Express API takes over storage in build step 6.
const DEMO_REQUESTS = [
  {
    id: 'sr-demo-01',
    offeredId: 'l-08', // Rohan's Samba OG
    requestedId: 'l-01', // your Levi's trucker
    status: 'Negotiating',
    createdAt: '2026-07-16T10:40:00.000Z',
    messages: [
      {
        id: 'dm-01',
        from: 'them',
        text: 'Hey! Would you take the Samba OGs for your trucker jacket? Both gently worn.',
        time: '10:42',
      },
      {
        id: 'dm-02',
        from: 'me',
        text: 'Tempting — but the values are a bit apart. Add the H&M beanie you listed and we have a deal.',
        time: '10:45',
      },
      {
        id: 'dm-03',
        from: 'them',
        text: 'Deal. Sending the updated offer now.',
        time: '10:47',
      },
    ],
  },
  {
    id: 'sr-demo-02',
    offeredId: 'l-12', // your selvedge jeans
    requestedId: 'l-13', // Priya's biker jacket
    status: 'Requested',
    createdAt: '2026-07-17T18:05:00.000Z',
    messages: [],
  },
  {
    id: 'sr-demo-03',
    offeredId: 'l-23', // your Nehru jacket
    requestedId: 'l-11', // Vikram's Raymond sweater
    status: 'Completed',
    createdAt: '2026-06-28T12:00:00.000Z',
    messages: [
      {
        id: 'dm-04',
        from: 'them',
        text: 'Sweater for the Nehru jacket — clean trade, values almost level.',
        time: '12:02',
      },
      {
        id: 'dm-05',
        from: 'me',
        text: 'Done. Rajiv Chowk metro, Saturday noon?',
        time: '12:10',
      },
      { id: 'dm-06', from: 'system', text: 'Swap completed on 05 Jul 2026', time: '' },
    ],
  },
]

export const useSwapStore = create(
  persist(
    (set) => ({
      offeredListing: null,
      requestedListing: null,
      activeRequest: null,
      requests: DEMO_REQUESTS,
      setOffer: (offeredListing) => set({ offeredListing }),
      setRequested: (requestedListing) => set({ requestedListing }),
      setActiveRequest: (activeRequest) => set({ activeRequest }),
      createRequest: ({ offeredId, requestedId }) => {
        const id = `sr-${Date.now().toString(36)}`
        const request = {
          id,
          offeredId,
          requestedId,
          status: 'Requested',
          createdAt: new Date().toISOString(),
          messages: [],
        }
        set((s) => ({ requests: [request, ...s.requests], activeRequest: request }))
        return id
      },
      updateRequestStatus: (id, status) =>
        set((s) => ({
          requests: s.requests.map((r) => (r.id === id ? { ...r, status } : r)),
        })),
      addMessage: (id, message) =>
        set((s) => ({
          requests: s.requests.map((r) =>
            r.id === id ? { ...r, messages: [...r.messages, message] } : r,
          ),
        })),
      clearNegotiation: () =>
        set({ offeredListing: null, requestedListing: null, activeRequest: null }),
    }),
    {
      name: 'swap-negotiations',
      // Union stored requests with the demo set: user edits to demo requests
      // win, user-created requests are kept, missing demos are re-added.
      merge: (persisted, current) => ({
        ...current,
        ...(persisted ?? {}),
        requests: [
          ...(persisted?.requests ?? []).filter(
            (r) => !DEMO_REQUESTS.some((d) => d.id === r.id),
          ),
          ...DEMO_REQUESTS.map(
            (d) => (persisted?.requests ?? []).find((r) => r.id === d.id) ?? d,
          ),
        ],
      }),
    },
  ),
)
