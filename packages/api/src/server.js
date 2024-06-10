import app from './app.js'
import { connectToDb as connectToMongoDb } from '@chords-extractor/common/mongo.js'
import { initializeAudioAnalysesQueue } from './queues/audioAnalysesQueue.js'

const startServer = async () => {
  try {
    const port = process.env.PORT || 3000

    await initializeAudioAnalysesQueue()
    await connectToMongoDb()

    app.listen(port, () => {
      console.log(`Server running on port http://localhost:${port}`)
    })
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

startServer()
