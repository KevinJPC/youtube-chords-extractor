import { ObjectId } from 'mongodb'
import AppError from '../utils/AppError.js'
import { errorCodes } from '@chords-extractor/common'
import { audioAnalysesCollection } from '@chords-extractor/common/mongo.js'

class AudioAnalysis {
  id
  youtubeId
  title
  duration
  isOriginal
  bpm
  beats
  chordsPerBeats
  numRatings
  totalRating
  user
  editTitle
  createdAt
  modifiedAt
  constructor ({
    id, youtubeId, title, duration, isOriginal, bpm, beats, chordsPerBeats,
    numRatings, totalRating,
    user, editTitle, createdAt, modifiedAt
  }) {
    this.id = id
    this.youtubeId = youtubeId
    this.title = title
    this.duration = duration
    this.isOriginal = isOriginal
    this.bpm = bpm
    this.beats = beats
    this.chordsPerBeats = chordsPerBeats
    this.numRatings = numRatings
    this.totalRating = totalRating

    this.user = user
    this.editTitle = editTitle

    this.createdAt = createdAt
    this.modifiedAt = modifiedAt
  }

  static async create ({ youtubeId, title, duration, bpm, chordsPerBeats }) {
    try {
      const date = new Date()
      const doc = {
        youtubeId,
        title,
        duration,
        isOriginal: true,
        bpm,
        chordsPerBeats,
        edits: 0,
        numRatings: 0,
        totalRating: 0,
        createdAt: date,
        modifiedAt: date
      }
      const { insertedId } = await audioAnalysesCollection().insertOne(doc)
      const newAudioAnalysis = { _id: insertedId, ...doc }
      return newAudioAnalysis
    } catch (error) {
      if (error.code === 11000) throw new AppError(errorCodes.AUDIO_ANALYSES_ALREADY_ANALYZED, 'Audio already analyze.', 409)
      throw error
    }
  }

  static async createCopy ({ fromId, editTitle, newChordsPerBeats }) {
    const audioAnalysisToCopy = audioAnalysesCollection().findOne({ _id: new ObjectId(fromId) })
    if (!audioAnalysisToCopy) return null

    const date = new Date()
    const doc = {
      ...audioAnalysisToCopy,
      chordsPerBeats: newChordsPerBeats,
      isOriginal: false,
      numRatings: 0,
      totalRating: 0,
      createdAt: date,
      modifiedAt: date,
      editTitle
      // user
    }
    const { insertedId } = await audioAnalysesCollection().insertOne(doc)
    const newAudioAnalysisCopy = { _id: insertedId, ...doc }
    return newAudioAnalysisCopy
  }

  static async findOne ({ ...args }) {
    try {
      if (args._id) args._id = new ObjectId(args._id)
      const audioAnalysis = await audioAnalysesCollection().findOne(args)
      if (!audioAnalysis) return null
      return audioAnalysis
    } catch (error) {
      if (error.name === 'BSONError') return null
      throw error
    }
  }

  static async findOriginalByYoutubeId ({ youtubeId }) {
    const audioAnalysis = await audioAnalysesCollection().findOne({ youtubeId, isOriginal: true })
    if (!audioAnalysis) return null
    return audioAnalysis
  }

  static async findEdit ({ youtubeId, id }) {
    const audioAnalysis = await AudioAnalysis.findOne({ _id: id, youtubeId })
    if (!audioAnalysis) return null
    return audioAnalysis
  }

  static async findAllOriginalsByYoutubeIds ({ youtubeIds }) {
    const audioAnalyses = []
    await audioAnalysesCollection().find({ youtubeId: { $in: youtubeIds }, isOriginal: true })
      .forEach((audioAnalysis) => {
        audioAnalyses.push(audioAnalysis)
      })
    return audioAnalyses
  }

  static async findAll ({ query }) {
    // not implemented yet
    // return AudioAnalysis instances
    return undefined
  }
}

export default AudioAnalysis
