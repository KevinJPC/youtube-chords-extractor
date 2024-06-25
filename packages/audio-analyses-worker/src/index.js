import { redisConfig } from '@chords-extractor/common'
import { Worker } from 'bullmq'
import { analyzeAudioProcessor } from './audioAnalyisProcessor.js'
import { connectToDb as connectToMongoDb } from '@chords-extractor/common/mongo.js'
import { loadPythonVenvInterpreter } from './python.js'

const main = async () => {
  await loadPythonVenvInterpreter()

  await connectToMongoDb()

  const audioAnalysesWorker = new Worker(
    redisConfig.audioAnalysesQueueName,
    analyzeAudioProcessor, {
      connection: { ...redisConfig },
      concurrency: 1
    }
  )

  audioAnalysesWorker.on('ready', () => {
    console.log('Worker is ready')
  })
  audioAnalysesWorker.on('active', (job) => {
    console.log(`Job [${job.id}] active.`)
  })

  audioAnalysesWorker.on('completed', (job) => {
    console.log(`Job [${job.id}] completed.`)
  })

  audioAnalysesWorker.on('failed', (job, err) => {
    console.log(`Job [${job.id}] failed. ${err}`)
  })
}

main()
