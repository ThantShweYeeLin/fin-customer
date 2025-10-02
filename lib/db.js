import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
    console.error('MongoDB URI is missing from environment variables')
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env',
    )
}

console.log('MongoDB URI configured:', MONGODB_URI ? 'Yes' : 'No')

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
    if (cached.conn) {
        console.log('Using existing MongoDB connection')
        return cached.conn
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        }
        console.log('Creating new MongoDB connection...')
        cached.promise = mongoose.connect(MONGODB_URI, opts)
        .then(mongoose => {
            console.log('DB connected successfully')
            return mongoose
        })
        .catch(error => {
            console.error('MongoDB connection error:', error)
            cached.promise = null
            throw error
        })
    }
    try {
        cached.conn = await cached.promise
    } catch (e) {
        console.error('Failed to establish MongoDB connection:', e)
        cached.promise = null
        throw e
    }

    return cached.conn
}

export default dbConnect