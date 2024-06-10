import { useEffect, useState } from 'react'
import { customContent } from '../components/Toaster'
import toast from 'react-hot-toast'
import { useUpdateSearchYoutubeQueryData } from './useUpdateSearchYoutubeQueryData'
import { useLocation } from 'wouter'
import { useCreateAudioAnalysisJobPolling } from './useCreateAudioAnalysisJobPolling'
import { useSearchParams } from './useSearchParams'

export const useAnalyzeResults = () => {
  const [selectedResultId, setSelectedResultId] = useState(null)
  const { q: currentQuery } = useSearchParams()
  const { updateResult } = useUpdateSearchYoutubeQueryData(currentQuery)
  const [, navigate] = useLocation()

  const {
    error,
    jobIsFailed,
    jobIsInQueue,
    jobIsProcessing,
    jobIsCompleted,
    jobResult,
    createJob,
    jobCreationIsPending
  } = useCreateAudioAnalysisJobPolling()

  useEffect(() => {
    if (!(jobIsFailed || error)) return
    toast.error((t) => customContent(t, 'An error had happend'), {
      id: 'job',
      duration: Infinity
    })
    return () => toast.dismiss('job')
  }, [jobIsFailed, error])

  useEffect(() => {
    if (!jobIsCompleted) return

    updateResult({
      youtubeId: jobResult.youtubeId,
      data: {
        isAnalyzed: true,
        audioAnalysis: {
          _id: jobResult._id,
          edits: jobResult.edits,
          bpm: jobResult.bpm
        }
      }
    })

    const timeoutId = setTimeout(() => {
      navigate(`chords/${jobResult.youtubeId}`)
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [jobIsCompleted])

  const analyze = ({ youtubeId }) => {
    if (selectedResultId && !(jobIsFailed || error)) return
    toast.dismiss('job')
    if (youtubeId !== selectedResultId) setSelectedResultId(youtubeId)
    createJob({ youtubeId })
  }

  return {
    selectedResultId,
    analyze,
    jobCreationIsPending,
    jobIsCompleted,
    jobIsInQueue,
    jobIsProcessing,
    jobIsFailed,
    error
  }
}
