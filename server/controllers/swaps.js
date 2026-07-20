import SwapRequest, { STATUSES } from '../models/SwapRequest.js'
import Listing from '../models/Listing.js'

const POPULATE = [
  { path: 'offered' },
  { path: 'requested' },
  { path: 'requester', select: 'name city rating' },
  { path: 'responder', select: 'name city rating' },
]

function publicRequest(doc) {
  const r = doc.toObject()
  const listing = (l) =>
    l?._id
      ? { id: l._id.toString(), itemId: l.itemId, title: l.title, brand: l.brand, category: l.category, size: l.size, condition: l.condition, city: l.city, image: l.image, swapValue: l.swapValue, status: l.status }
      : l?.toString()
  const person = (u) => (u?._id ? { id: u._id.toString(), name: u.name, city: u.city, rating: u.rating } : u?.toString())
  return {
    id: r._id.toString(),
    status: r.status,
    createdAt: r.createdAt,
    offered: listing(r.offered),
    requested: listing(r.requested),
    requester: person(r.requester),
    responder: person(r.responder),
    messages: (r.messages ?? []).map((m) => ({
      id: m._id.toString(),
      from: m.from?.toString() ?? 'system',
      text: m.text,
      at: m.at,
    })),
  }
}

const isParticipant = (request, userId) =>
  request.requester._id?.equals?.(userId) ||
  request.responder._id?.equals?.(userId) ||
  request.requester.equals?.(userId) ||
  request.responder.equals?.(userId)

export async function listMyRequests(req, res) {
  const requests = await SwapRequest.find({
    $or: [{ requester: req.user._id }, { responder: req.user._id }],
  })
    .sort({ updatedAt: -1 })
    .populate(POPULATE)
  res.json({ requests: requests.map(publicRequest) })
}

export async function getRequest(req, res) {
  const request = await SwapRequest.findById(req.params.id).populate(POPULATE)
  if (!request) return res.status(404).json({ message: 'Request not found' })
  if (!isParticipant(request, req.user._id) && req.user.role !== 'admin')
    return res.status(403).json({ message: 'Not your negotiation' })
  res.json({ request: publicRequest(request) })
}

export async function createRequest(req, res) {
  const { offeredId, requestedId } = req.body ?? {}
  const [offered, requested] = await Promise.all([
    Listing.findById(offeredId),
    Listing.findById(requestedId),
  ])
  if (!offered || !requested) return res.status(404).json({ message: 'Listing not found' })
  if (!offered.owner.equals(req.user._id))
    return res.status(403).json({ message: 'You can only offer your own pieces' })
  if (requested.owner.equals(req.user._id))
    return res.status(400).json({ message: 'That piece is already yours' })
  if (offered.status !== 'available' || requested.status !== 'available')
    return res.status(409).json({ message: 'One of these pieces is no longer available' })

  const request = await SwapRequest.create({
    offered: offered._id,
    requested: requested._id,
    requester: req.user._id,
    responder: requested.owner,
  })
  await request.populate(POPULATE)
  res.status(201).json({ request: publicRequest(request) })
}

// Legal moves in the lifecycle — server-enforced, mirrors the UI stepper.
const TRANSITIONS = {
  Requested: ['Negotiating', 'Accepted', 'Declined'],
  Negotiating: ['Accepted', 'Declined'],
  Accepted: ['Exchanged', 'Declined'],
  Exchanged: ['Completed'],
  Completed: [],
  Declined: [],
}

export async function updateStatus(req, res) {
  const { status } = req.body ?? {}
  if (!STATUSES.includes(status)) return res.status(400).json({ message: 'Unknown status' })
  const request = await SwapRequest.findById(req.params.id).populate(POPULATE)
  if (!request) return res.status(404).json({ message: 'Request not found' })
  if (!isParticipant(request, req.user._id))
    return res.status(403).json({ message: 'Not your negotiation' })
  if (!TRANSITIONS[request.status].includes(status))
    return res.status(409).json({ message: `Cannot go from ${request.status} to ${status}` })

  request.status = status
  request.messages.push({ from: null, text: `Status changed to ${status}` })
  if (status === 'Completed') {
    await Listing.updateMany(
      { _id: { $in: [request.offered._id, request.requested._id] } },
      { status: 'swapped' },
    )
  }
  await request.save()
  res.json({ request: publicRequest(request) })
}

export async function addMessage(req, res) {
  const { text } = req.body ?? {}
  if (!text?.trim()) return res.status(400).json({ message: 'Message text is required' })
  const request = await SwapRequest.findById(req.params.id).populate(POPULATE)
  if (!request) return res.status(404).json({ message: 'Request not found' })
  if (!isParticipant(request, req.user._id))
    return res.status(403).json({ message: 'Not your negotiation' })

  request.messages.push({ from: req.user._id, text: text.trim() })
  if (request.status === 'Requested') request.status = 'Negotiating'
  await request.save()
  res.status(201).json({ request: publicRequest(request) })
}
