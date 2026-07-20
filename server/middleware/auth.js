import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const SECRET = () => process.env.JWT_SECRET ?? 'dev-secret-do-not-use-in-prod'

export function signToken(user) {
  return jwt.sign({ id: user._id.toString(), role: user.role }, SECRET(), { expiresIn: '7d' })
}

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization ?? ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) return res.status(401).json({ message: 'Sign in to continue' })
    const payload = jwt.verify(token, SECRET())
    const user = await User.findById(payload.id)
    if (!user) return res.status(401).json({ message: 'Account no longer exists' })
    if (user.suspended) return res.status(403).json({ message: 'This account is suspended' })
    req.user = user
    next()
  } catch {
    return res.status(401).json({ message: 'Session expired — sign in again' })
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' })
  }
  next()
}
