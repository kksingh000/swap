import 'dotenv/config'
import { connectDB } from './config/db.js'
import { seedIfEmpty } from './seed/seed.js'
import app from './app.js'

const PORT = process.env.PORT ?? 5000

// Refuse to boot in production without a real signing secret — otherwise the
// dev fallback would make every JWT forgeable.
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.error('[fatal] JWT_SECRET must be set in production. Refusing to start.')
  process.exit(1)
}

await connectDB()
await seedIfEmpty()

app.listen(PORT, () => console.log(`[swap-api] listening on :${PORT}`))
