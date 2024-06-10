import { errorCodes } from '@chords-extractor/common'
import { httpCodes } from '../constants/index.js'
import AudioAnalysis from '../models/AudioAnalysis.js'
import audioAnalysisJobService from '../services/audioAnalysisJobService.js'
import { youtubeMusicService } from '../services/youtubeMusicService.js'
import AppError from '../utils/AppError.js'
import { tryCatch } from '../utils/tryCatch.js'
import { getYoutubeId } from '../utils/getYoutubeId.js'

export const getAudioAnalysisByYoutubeId = tryCatch(async (req, res) => {
  const { youtubeId } = req.params
  const { edit } = req.query

  let audioAnalysis = null
  if (edit) audioAnalysis = await AudioAnalysis.findEdit({ youtubeId, id: edit })
  else audioAnalysis = await AudioAnalysis.findOriginalByYoutubeId({ youtubeId })

  if (audioAnalysis === null) throw new AppError(errorCodes.AUDIO_ANALYSES_NOT_FOUND, 'Audio analysis not found.', httpCodes.NOT_FOUND)

  res.status(httpCodes.OK).json({
    status: 'success',
    data: { ...audioAnalysis }
  })
}
)

export const createAudioAnalysisJob = tryCatch(async (req, res) => {
  const { youtubeId } = req.body
  if (youtubeId === undefined) throw new Error('Youtube id was not provided')

  const job = await audioAnalysisJobService.createAudioAnalysisJob({ id: youtubeId })

  res.status(httpCodes.CREATED).json({
    status: 'success',
    data: {
      id: job.id,
      status: job.status,
      result: job.result
    }
  })
})

export const getAudioAnalysisJob = tryCatch(async (req, res) => {
  const { id } = req.params

  const job = await audioAnalysisJobService.findAudioAnalysisJob({ id })

  res.status(httpCodes.OK).json({
    status: 'success',
    data: {
      id: job.id,
      status: job.status,
      result: job.result
    }
  })
})

export const getYoutubeResultsWithAnalyzeStatus = tryCatch(async (req, res) => {
  const { q } = req.query

  let results
  // if the query is youtube url then it will search for an specific video instead
  const youtubeId = getYoutubeId(q)
  if (youtubeId) {
    const video = await youtubeMusicService.findVideo({ id: youtubeId })
    results = video ? [video] : []
  } else {
    results = await youtubeMusicService.search({ query: q })
  }

  // Fast return no need to continue processing req
  if (results.length === 0) {
    return res.status(httpCodes.OK).json({
      status: 'success',
      data: {
        results: []
      }
    })
  }

  const resultsIds = results.map(result => result.id)

  const resultsAlreadyAnalyzed = await AudioAnalysis.findAllOriginalsByYoutubeIds({ youtubeIds: resultsIds })

  const mappedResults = results.map(({ id: youtubeId, title, duration }) => {
    const audioAnalysis = resultsAlreadyAnalyzed.find(audioAnalysis => audioAnalysis.youtubeId === youtubeId)

    return {
      youtubeId,
      title,
      duration,
      isAnalyzed: audioAnalysis !== undefined,
      audioAnalysis: audioAnalysis !== undefined
        ? {
            _id: audioAnalysis._id,
            edits: audioAnalysis.edits,
            bpm: audioAnalysis.bpm
          }
        : null
    }
  })

  res.status(httpCodes.OK).json({
    status: 'success',
    data: {
      results: mappedResults
    }
  })
})

export const getAllAudioAnalyses = tryCatch(async (req, res) => {
  // const { page } = req.body

  res.status(501).json({
    status: 'fail',
    message: 'Not implemented yet',
    data: {}
  })
})
