import { mongoConfig } from '@chords-extractor/common'
import ConnectMongoDBSession from 'connect-mongodb-session'
import session from 'express-session'
import { SESSION_COOKIE_NAME } from '../constants/index.js'

export const initSession = () => {
  const MongoDBStore = ConnectMongoDBSession(session)

  const store = new MongoDBStore({
    uri: mongoConfig.uri,
    databaseName: mongoConfig.dbName,
    collection: 'sessions'
  })

  return session({
    unset: 'destroy',
    store,
    name: SESSION_COOKIE_NAME,
    cookie: {
      maxAge: 1000 * 1 * 60 * 60 * 24 * 30
    },
    saveUninitialized: false,
    resave: true,
    rolling: true,
    secret: 'super_secret_key'
  })
}
