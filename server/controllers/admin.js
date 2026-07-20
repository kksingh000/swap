import User from '../models/User.js'
import Listing from '../models/Listing.js'
import SwapRequest from '../models/SwapRequest.js'
import Dispute from '../models/Dispute.js'

export async function stats(req, res) {
  const [listings, users, requests, completed, openDisputes] = await Promise.all([
    Listing.countDocuments({ status: { $ne: 'removed' } }),
    User.countDocuments({ suspended: false }),
    SwapRequest.countDocuments(),
    SwapRequest.countDocuments({ status: 'Completed' }),
    Dispute.countDocuments({ status: 'open' }),
  ])

  const monthly = await Listing.aggregate([
    { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$listedAt' } }, listings: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ])
  const byStatus = await SwapRequest.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ])

  res.json({
    kpis: {
      listingsLive: listings,
      activeMembers: users,
      swapsCompleted: completed,
      conversionRate: requests ? Math.round((completed / requests) * 100) : 0,
      openDisputes,
    },
    monthly: monthly.map((m) => ({ month: m._id, listings: m.listings })),
    byStatus: byStatus.map((s) => ({ status: s._id, count: s.count })),
  })
}

export async function listUsers(req, res) {
  const users = await User.find().sort({ swapsCompleted: -1 })
  res.json({ users: users.map((u) => u.toPublic()) })
}

export async function setUserSuspended(req, res) {
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ message: 'User not found' })
  if (user.role === 'admin') return res.status(400).json({ message: 'Cannot suspend an admin' })
  user.suspended = Boolean(req.body?.suspended)
  await user.save()
  res.json({ user: user.toPublic() })
}

export async function listAllListings(req, res) {
  const listings = await Listing.find().sort({ listedAt: -1 }).populate('owner', 'name')
  res.json({
    listings: listings.map((l) => ({
      id: l._id.toString(),
      itemId: l.itemId,
      title: l.title,
      brand: l.brand,
      category: l.category,
      city: l.city,
      swapValue: l.swapValue,
      status: l.status,
      owner: l.owner?.name,
    })),
  })
}

export async function listDisputes(req, res) {
  const disputes = await Dispute.find()
    .sort({ openedAt: -1 })
    .populate('raisedBy against', 'name')
    .populate('request', 'status')
  res.json({
    disputes: disputes.map((d) => ({
      id: d._id.toString(),
      requestId: d.request?._id?.toString(),
      raisedBy: d.raisedBy?.name,
      against: d.against?.name,
      reason: d.reason,
      status: d.status,
      resolution: d.resolution,
      openedAt: d.openedAt,
    })),
  })
}

export async function resolveDispute(req, res) {
  const dispute = await Dispute.findById(req.params.id)
  if (!dispute) return res.status(404).json({ message: 'Dispute not found' })
  if (dispute.status === 'resolved') return res.status(409).json({ message: 'Already resolved' })
  dispute.status = 'resolved'
  dispute.resolution = req.body?.resolution?.trim() || 'Resolved by moderator'
  await dispute.save()
  res.json({ ok: true })
}
