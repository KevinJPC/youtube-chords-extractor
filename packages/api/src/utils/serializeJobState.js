import { JOB_STATUS_BY_STATE } from '@chords-extractor/common/audioAnalysisStatus.js'

export const serializeJobState = (jobState) => {
  return JOB_STATUS_BY_STATE[jobState] || null
}
