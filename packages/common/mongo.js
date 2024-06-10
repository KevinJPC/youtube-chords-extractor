import { mongoConfig } from '@chords-extractor/common'
import { MongoClient, ServerApiVersion } from 'mongodb'

let _db

export const connectToDb = async () => {
  try {
    const client = new MongoClient(mongoConfig.uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      }
    })
    const connection = await client.connect()
    _db = connection.db(mongoConfig.dbName)
    await _db.command({ ping: 1 })
    console.log('Mongo DB connection successful')
  } catch (error) {
    throw new Error(`Mongo DB connection failed. ${error.message}`)
  }
}

export const db = () => {
  if (!_db) throw new Error('No database connection')
  return _db
}

export const audioAnalysesCollection = () => db().collection('audio-analyses')
export const usersCollection = () => db().collection('users')
export const emailVerificationTokensCollection = () => db().collection('emailVerificationTokens')
