import mongoose from 'mongoose'

export const CATEGORIES = [
  'Outerwear',
  'Footwear',
  'Ethnic',
  'Dresses',
  'Denim',
  'Knitwear',
  'Shirts',
  'Tees',
  'Accessories',
]
export const CONDITIONS = ['New with tags', 'Like new', 'Gently used', 'Well loved']

const listingSchema = new mongoose.Schema(
  {
    itemId: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    category: { type: String, enum: CATEGORIES, required: true },
    size: { type: String, required: true },
    condition: { type: String, enum: CONDITIONS, required: true },
    city: { type: String, required: true },
    description: { type: String, default: '' },
    image: { type: String, default: null },
    swapValue: { type: Number, required: true },
    status: {
      type: String,
      enum: ['available', 'pending', 'swapped', 'removed'],
      default: 'available',
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: { createdAt: 'listedAt', updatedAt: true } },
)

listingSchema.index({ category: 1, city: 1, status: 1 })

export default mongoose.model('Listing', listingSchema)
