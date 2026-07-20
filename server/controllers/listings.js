import Listing, { CATEGORIES, CONDITIONS } from '../models/Listing.js'
import { estimateValue } from '../lib/swapValue.js'

const SORTS = {
  new: { listedAt: -1 },
  'value-desc': { swapValue: -1 },
  'value-asc': { swapValue: 1 },
}

function publicListing(doc) {
  const l = doc.toObject({ virtuals: false })
  return {
    id: l._id.toString(),
    itemId: l.itemId,
    title: l.title,
    brand: l.brand,
    category: l.category,
    size: l.size,
    condition: l.condition,
    city: l.city,
    description: l.description,
    image: l.image,
    swapValue: l.swapValue,
    status: l.status,
    listedAt: l.listedAt,
    owner: l.owner?._id
      ? { id: l.owner._id.toString(), name: l.owner.name, city: l.owner.city, rating: l.owner.rating, swapsCompleted: l.owner.swapsCompleted, joinedAt: l.owner.joinedAt }
      : l.owner?.toString(),
  }
}

export async function listListings(req, res) {
  const { category, size, brand, condition, city, sort = 'new', page = 1, limit = 8 } = req.query
  const query = { status: 'available' }
  const asList = (v) => (Array.isArray(v) ? v : String(v).split(',').filter(Boolean))
  if (category) query.category = { $in: asList(category) }
  if (size) query.size = { $in: asList(size) }
  if (brand) query.brand = { $in: asList(brand) }
  if (condition) query.condition = { $in: asList(condition) }
  if (city) query.city = city

  const pageNum = Math.max(1, Number(page) || 1)
  const perPage = Math.min(24, Math.max(1, Number(limit) || 8))
  const [items, total] = await Promise.all([
    Listing.find(query)
      .sort(SORTS[sort] ?? SORTS.new)
      .skip((pageNum - 1) * perPage)
      .limit(perPage)
      .populate('owner', 'name city rating swapsCompleted joinedAt'),
    Listing.countDocuments(query),
  ])
  res.json({
    items: items.map(publicListing),
    total,
    page: pageNum,
    pages: Math.max(1, Math.ceil(total / perPage)),
  })
}

export async function getListing(req, res) {
  const listing = await Listing.findById(req.params.id).populate(
    'owner',
    'name city rating swapsCompleted joinedAt',
  )
  if (!listing) return res.status(404).json({ message: 'Listing not found' })
  res.json({ listing: publicListing(listing) })
}

export async function createListing(req, res) {
  const { title, brand, category, size, condition, description = '', image = null } = req.body ?? {}
  if (!title?.trim() || !brand?.trim() || !size?.trim())
    return res.status(400).json({ message: 'Title, brand and size are required' })
  if (!CATEGORIES.includes(category)) return res.status(400).json({ message: 'Unknown category' })
  if (!CONDITIONS.includes(condition)) return res.status(400).json({ message: 'Unknown condition' })

  const count = await Listing.countDocuments()
  const listing = await Listing.create({
    itemId: `SW-${1042 + count * 7}`,
    title: title.trim(),
    brand: brand.trim(),
    category,
    size: size.trim(),
    condition,
    description,
    image,
    city: req.user.city,
    owner: req.user._id,
    swapValue: estimateValue({ category, brand, condition }),
  })
  res.status(201).json({ listing: publicListing(listing) })
}

export async function updateListing(req, res) {
  const listing = await Listing.findById(req.params.id)
  if (!listing) return res.status(404).json({ message: 'Listing not found' })
  if (!listing.owner.equals(req.user._id) && req.user.role !== 'admin')
    return res.status(403).json({ message: 'Not your listing' })

  const allowed = ['title', 'brand', 'category', 'size', 'condition', 'description', 'image', 'status']
  for (const key of allowed) if (key in (req.body ?? {})) listing[key] = req.body[key]
  listing.swapValue = estimateValue(listing)
  await listing.save()
  res.json({ listing: publicListing(listing) })
}

export async function deleteListing(req, res) {
  const listing = await Listing.findById(req.params.id)
  if (!listing) return res.status(404).json({ message: 'Listing not found' })
  if (!listing.owner.equals(req.user._id) && req.user.role !== 'admin')
    return res.status(403).json({ message: 'Not your listing' })
  listing.status = 'removed'
  await listing.save()
  res.json({ ok: true })
}
