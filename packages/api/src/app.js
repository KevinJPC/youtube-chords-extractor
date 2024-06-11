import express from 'express'
import { initCors } from './middlewares/cors.js'
import { initJsonParser } from './middlewares/jsonParser.js'
import { initSession } from './middlewares/session.js'
import { initPassport } from './middlewares/passport.js'
import { initMorgan } from './middlewares/morgan.js'
import routes from './routes/index.js'
import { errorHandler } from './middlewares/errorHandler.js'

const app = express()

// app.use(initCors())
app.use(initJsonParser())
app.use(initMorgan())
app.use(initSession())
app.use(initPassport())

app.use(routes)

app.use(errorHandler)

export default app
