import { Queue } from 'bullmq'
import { redisConfig } from '@chords-extractor/common'

let _audioAnalysesQueue

export const initializeAudioAnalysesQueue = async () => {
  const newAudioAnalysesQueue = new Queue(
    redisConfig.audioAnalysesQueueName, {
      connection: {
        ...redisConfig,
        // fast failing if redis is down
        enableOfflineQueue: false,
        maxRetriesPerRequest: 1
      },
      defaultJobOptions: {
        attempts: 0,
        removeOnComplete: {
          age: 30
        },
        removeOnFail: {
          age: 30
        }
      }
    }
  )
  /* Currently, for failing fast to be enable there is a limitation in that the Redis instance must at least be online
  ** while the queue is being instantiated.
  ** https://docs.bullmq.io/patterns/failing-fast-when-redis-is-down
  **/
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Redis db connection failed.'))
    }, 1000)
    newAudioAnalysesQueue.client.then(c => {
      clearTimeout(timeoutId)
      _audioAnalysesQueue = newAudioAnalysesQueue
      console.log('Redis DB connection successful')
      resolve()
    }).catch((err) => {
      clearTimeout(timeoutId)
      reject(new Error(`Redis db connection failed. ${err.message}`))
    })
  })
}

export const audioAnalysesQueue = () => {
  if (!_audioAnalysesQueue) throw new Error('No database connection')
  return _audioAnalysesQueue
}
