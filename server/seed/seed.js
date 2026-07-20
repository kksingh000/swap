import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import Listing from '../models/Listing.js'
import SwapRequest from '../models/SwapRequest.js'
import Dispute from '../models/Dispute.js'
import { estimateValue } from '../lib/swapValue.js'
import { seedUsers, seedListings, seedRequests, seedDisputes } from './data.js'

// Idempotent: seeds only when the database is empty.
export async function seedIfEmpty() {
  if ((await User.countDocuments()) > 0) return
  console.log('[seed] empty database — seeding demo catalogue')

  const passwordHash = await bcrypt.hash('password123', 10)
  const users = {}
  for (const u of seedUsers) {
    users[u.key] = await User.create({ ...u, key: undefined, passwordHash })
  }
  const admin = await User.create({
    name: 'Krishna Singh',
    email: 'admin@swap.in',
    passwordHash: await bcrypt.hash('admin123', 10),
    city: 'New Delhi',
    role: 'admin',
  })

  const listingsByItemId = {}
  for (const l of seedListings) {
    listingsByItemId[l.itemId] = await Listing.create({
      ...l,
      owner: users[l.owner]._id,
      swapValue: estimateValue(l),
      listedAt: new Date(l.listedAt),
    })
  }

  const requests = []
  for (const r of seedRequests) {
    const offered = listingsByItemId[r.offered]
    const requested = listingsByItemId[r.requested]
    requests.push(
      await SwapRequest.create({
        offered: offered._id,
        requested: requested._id,
        requester: users[r.requester]._id,
        responder: (await Listing.findById(requested._id)).owner,
        status: r.status,
        messages: r.messages.map((m) => ({ from: users[m.from]._id, text: m.text })),
      }),
    )
  }

  for (const d of seedDisputes) {
    await Dispute.create({
      request: requests[d.request]._id,
      raisedBy: users[d.raisedBy]._id,
      against: users[d.against]._id,
      reason: d.reason,
    })
  }

  console.log(
    `[seed] done — ${seedUsers.length + 1} users (admin@swap.in / admin123, others password123), ${seedListings.length} listings, ${requests.length} requests, ${seedDisputes.length} disputes`,
  )
}
