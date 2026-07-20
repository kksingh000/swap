// Thin fetch wrapper. Pages run on mock/seed data until the Express API lands
// (build step 6); at that point calls swap over to this incrementally.

import { useAuthStore } from '../store/authStore'

const BASE = import.meta.env.VITE_API_URL ?? ''

export async function api(path, { method = 'GET', body } = {}) {
  const token = useAuthStore.getState().token
  const res = await fetch(`${BASE}/api${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message ?? `Request failed (${res.status})`)
  return data
}
