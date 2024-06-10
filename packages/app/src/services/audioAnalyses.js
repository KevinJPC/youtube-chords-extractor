const isProd = import.meta.env.PROD
const BACKEND_URL = isProd ? import.meta.env.VITE_BACKEND_URL : window.location.origin

export const getAudioAnalysisByYoutubeId = async ({ youtubeId }) => {
  const endpoint = `${BACKEND_URL}/api/audio-analyses/${youtubeId}`
  const res = await fetch(endpoint, {
    headers: { 'Content-Type': 'application/json' }
  })
  const { data } = await res.json()
  const audioAnalysis = {
    _id: data._id,
    title: data.title,
    youtubeId: data.youtubeId,
    duration: data.duration,
    isOriginal: data.isOriginal,
    bpm: data.bpm,
    chordsPerBeats: data.chordsPerBeats,
    numRatings: data.numRatings,
    totalRating: data.totalRating,
    createdAt: data.createdAt,
    modifiedAt: data.modifiedAt
  }
  return audioAnalysis
}

export const getYoutubeResultsWithAnalyzeStatus = async ({ q }) => {
  const endpoint = `${BACKEND_URL}/api/audio-analyses/youtube-search`
  const searchParams = new URLSearchParams({ q })
  const res = await fetch(`${endpoint}?${searchParams.toString()}`, {
    headers: { 'Content-Type': 'application/json' }
  })
  const { data } = await res.json()
  const mappedResults = data.results.map((result) => ({
    title: result.title,
    youtubeId: result.youtubeId,
    duration: result.duration,
    isAnalyzed: result.isAnalyzed,
    audioAnalysis: result.audioAnalysis !== null
      ? {
          _id: result.audioAnalysis._id,
          edits: result.audioAnalysis.edits,
          bpm: result.audioAnalysis.bpm
        }
      : null
  }))
  return { results: mappedResults }
}

export const createAudioAnalysisJob = async ({ youtubeId }) => {
  const endpoint = `${BACKEND_URL}/api/audio-analyses/job`
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      youtubeId
    })
  })
  const { data } = await res.json()
  return { id: data.id, status: data.status, result: data.result }
}

export const getAudioAnalysisJob = async ({ jobId }) => {
  const endpoint = `${BACKEND_URL}/api/audio-analyses/job/${jobId}`
  const res = await fetch(endpoint)
  const { data } = await res.json()
  return { id: data.id, status: data.status, result: data.result }
}
