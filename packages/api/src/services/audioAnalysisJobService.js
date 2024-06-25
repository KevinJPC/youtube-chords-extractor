import { errorCodes } from '@chords-extractor/common'
import { httpCodes } from '../constants/index.js'
import AudioAnalysis from '../models/AudioAnalysis.js'
import AppError from '../utils/AppError.js'
import { youtubeMusicService } from './youtubeMusicService.js'
import { audioAnalysesQueue } from '../queues/audioAnalysesQueue.js'
import { serializeJobState } from '../utils/serializeJobState.js'
import { JOB_STATUS } from '@chords-extractor/common/audioAnalysisStatus.js'

const createAudioAnalysisJob = async ({ id }) => {
  try {
    const audioAnalysis = await AudioAnalysis.findOriginalByYoutubeId({ youtubeId: id })
    // return default fake job values and the already analyze audio info
    if (audioAnalysis !== null) return { id: null, status: JOB_STATUS.completed, result: audioAnalysis }
    const video = await youtubeMusicService.findVideo({ id })
    if (video === undefined) throw new AppError(errorCodes.AUDIO_ANALYSES_YOUTUBE_VIDEO_NOT_FOUND, 'Youtube video not found', httpCodes.NOT_FOUND)
    const { title, duration } = video
    //  TODO: validate song max duration
    if (duration > 900) throw new AppError('VIDEO_DURATION_TOO_LONG', 'Song is too long', 400)
    const job = await audioAnalysesQueue().add(id, {
      youtubeId: id,
      title,
      duration
    }, {
      jobId: id
    })
    const jobState = await audioAnalysesQueue().getJobState(id)
    const jobStatus = serializeJobState(jobState)
    if (jobStatus === null) {
      throw new AppError('AUDIO_ANALYSIS_JOB_NOT_FOUND', 'Audio analysis job not found', 404)
    }
    if (jobStatus === JOB_STATUS.failed) {
      await job.retry()
      return { id: job.id, status: JOB_STATUS.waiting, result: null }
    }
    if (jobStatus === JOB_STATUS.completed) {
      const audioAnalysis = await AudioAnalysis.findOriginalByYoutubeId({ youtubeId: id })
      return { id: null, status: JOB_STATUS.completed, result: audioAnalysis }
    }
    return { id: job.id, status: jobStatus, result: null }
  } catch (error) {
    console.log(error)
    throw error
  }
}

const findAudioAnalysisJob = async ({ id }) => {
  try {
    const jobState = await audioAnalysesQueue().getJobState(id)
    const jobStatus = serializeJobState(jobState)
    if (jobStatus === null) {
      throw new AppError('AUDIO_ANALYSIS_JOB_NOT_FOUND', 'Audio analysis job not found', 404)
    }
    if (jobStatus === JOB_STATUS.completed) {
      const audioAnalysis = await AudioAnalysis.findOriginalByYoutubeId({ youtubeId: id })
      return { id, status: jobStatus, result: audioAnalysis }
    }
    return { id, status: jobStatus, result: null }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export default { createAudioAnalysisJob, findAudioAnalysisJob }
