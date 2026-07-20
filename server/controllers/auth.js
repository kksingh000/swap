import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { signToken } from '../middleware/auth.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function register(req, res) {
  const { name, email, password, city } = req.body ?? {}
  if (!name?.trim()) return res.status(400).json({ message: 'Name is required' })
  if (!EMAIL_RE.test(email ?? '')) return res.status(400).json({ message: 'Enter a valid email address' })
  if ((password ?? '').length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' })
  if (!city?.trim()) return res.status(400).json({ message: 'City is required' })

  const existing = await User.findOne({ email: email.toLowerCase() })
  if (existing) return res.status(409).json({ message: 'An account with this email already exists' })

  const user = await User.create({
    name: name.trim(),
    email,
    passwordHash: await bcrypt.hash(password, 10),
    city: city.trim(),
  })
  res.status(201).json({ user: user.toPublic(), token: signToken(user) })
}

export async function login(req, res) {
  const { email, password } = req.body ?? {}
  // Reject non-string credentials (e.g. a `{$gt:""}` injection attempt) with a
  // clean 401 rather than throwing, and keep query operators out of the lookup.
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(401).json({ message: 'Email or password is incorrect' })
  }
  const user = await User.findOne({ email: email.toLowerCase() })
  if (!user || !(await bcrypt.compare(password ?? '', user.passwordHash))) {
    return res.status(401).json({ message: 'Email or password is incorrect' })
  }
  if (user.suspended) return res.status(403).json({ message: 'This account is suspended' })
  res.json({ user: user.toPublic(), token: signToken(user) })
}

export async function me(req, res) {
  res.json({ user: req.user.toPublic() })
}
