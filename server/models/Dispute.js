import mongoose from 'mongoose'

const disputeSchema = new mongoose.Schema(
  {
    request: { type: mongoose.Schema.Types.ObjectId, ref: 'SwapRequest', required: true },
    raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    against: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true, trim: true },
    status: { type: String, enum: ['open', 'resolved'], default: 'open' },
    resolution: { type: String, default: null },
  },
  { timestamps: { createdAt: 'openedAt', updatedAt: true } },
)

export default mongoose.model('Dispute', disputeSchema)
