import mongoose from 'mongoose'

// Connects to MONGODB_URI (Atlas in production). Without one — local dev,
// CI, quick demos — it spins up an in-memory MongoDB that seeds itself.
export async function connectDB() {
  let uri = process.env.MONGODB_URI
  if (!uri) {
    const { MongoMemoryServer } = await import('mongodb-memory-server')
    const mem = await MongoMemoryServer.create()
    uri = mem.getUri('swap')
    console.log('[db] No MONGODB_URI set — using in-memory MongoDB (data resets on restart)')
  }
  await mongoose.connect(uri)
  console.log('[db] connected')
}
