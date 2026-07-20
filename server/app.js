import express from 'express'
import cors from 'cors'
import { requireAuth, requireAdmin } from './middleware/auth.js'
import * as auth from './controllers/auth.js'
import * as listings from './controllers/listings.js'
import * as swaps from './controllers/swaps.js'
import * as admin from './controllers/admin.js'

const app = express()

const origins = (process.env.CORS_ORIGINS ?? 'http://localhost:5173,https://swap-atelier.vercel.app')
  .split(',')
  .map((o) => o.trim())
app.use(cors({ origin: origins }))
app.use(express.json({ limit: '1mb' }))

// Wraps async handlers so thrown errors reach the error middleware.
const h = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'swap-api' }))

app.post('/api/auth/register', h(auth.register))
app.post('/api/auth/login', h(auth.login))
app.get('/api/auth/me', h(requireAuth), h(auth.me))

app.get('/api/listings', h(listings.listListings))
app.get('/api/listings/:id', h(listings.getListing))
app.post('/api/listings', h(requireAuth), h(listings.createListing))
app.put('/api/listings/:id', h(requireAuth), h(listings.updateListing))
app.delete('/api/listings/:id', h(requireAuth), h(listings.deleteListing))

app.get('/api/swaps', h(requireAuth), h(swaps.listMyRequests))
app.post('/api/swaps', h(requireAuth), h(swaps.createRequest))
app.get('/api/swaps/:id', h(requireAuth), h(swaps.getRequest))
app.patch('/api/swaps/:id/status', h(requireAuth), h(swaps.updateStatus))
app.post('/api/swaps/:id/messages', h(requireAuth), h(swaps.addMessage))

app.get('/api/admin/stats', h(requireAuth), requireAdmin, h(admin.stats))
app.get('/api/admin/users', h(requireAuth), requireAdmin, h(admin.listUsers))
app.patch('/api/admin/users/:id', h(requireAuth), requireAdmin, h(admin.setUserSuspended))
app.get('/api/admin/listings', h(requireAuth), requireAdmin, h(admin.listAllListings))
app.get('/api/admin/disputes', h(requireAuth), requireAdmin, h(admin.listDisputes))
app.patch('/api/admin/disputes/:id', h(requireAuth), requireAdmin, h(admin.resolveDispute))

app.use((req, res) => res.status(404).json({ message: 'Not found' }))

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[error]', err.message)
  const status = err.name === 'CastError' ? 400 : 500
  res.status(status).json({ message: status === 400 ? 'Invalid id' : 'Something went wrong' })
})

export default app
