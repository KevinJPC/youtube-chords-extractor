import { redisConfig } from '@chords-extractor/common'
import { Worker } from 'bullmq'
import { analyzeAudioProcessor } from './analyzeAudioProcessor.js'
import { connectToDb as connectToMongoDb } from '@chords-extractor/common/mongo.js'

const main = async () => {
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
    console.log('active:', job.data?.youtubeId)
  })

  audioAnalysesWorker.on('completed', (job) => {
    console.log('completed:', job.data?.youtubeId)
  })

  audioAnalysesWorker.on('waiting', (job) => {
    console.log('waiting:', job.data?.youtubeId)
  })

  audioAnalysesWorker.on('failed', (job, err) => {
    console.log('error:', job.data?.youtubeId, err)
  })
}

main()
