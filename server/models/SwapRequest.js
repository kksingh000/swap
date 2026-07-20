import mongoose from 'mongoose'

export const STATUSES = [
  'Requested',
  'Negotiating',
  'Accepted',
  'Exchanged',
  'Completed',
  'Declined',
]

const messageSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // null = system
    text: { type: String, required: true, trim: true },
  },
  { timestamps: { createdAt: 'at', updatedAt: false } },
)

const swapRequestSchema = new mongoose.Schema(
  {
    offered: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    requested: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    responder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: STATUSES, default: 'Requested' },
    messages: [messageSchema],
  },
  { timestamps: true },
)

export default mongoose.model('SwapRequest', swapRequestSchema)
