import { audioAnalysesCollection } from '@chords-extractor/common/mongo.js'

class AudioAnalysis {
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
      // if (error.code === 11000) throw new AppError(errorCodes.AUDIO_ANALYSES_ALREADY_ANALYZED, 'Audio already analyze.', 409)
      if (error.code === 11000) throw new Error('Audio already analyze.')
      throw error
    }
  }
}

export default AudioAnalysis
