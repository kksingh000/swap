import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    city: { type: String, required: true },
    rating: { type: Number, default: 5 },
    swapsCompleted: { type: Number, default: 0 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    suspended: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: 'joinedAt', updatedAt: true } },
)

userSchema.methods.toPublic = function () {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    city: this.city,
    rating: this.rating,
    swapsCompleted: this.swapsCompleted,
    role: this.role,
    suspended: this.suspended,
    joinedAt: this.joinedAt,
  }
}

export default mongoose.model('User', userSchema)
