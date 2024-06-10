import { useMutation, useQuery } from '@tanstack/react-query'
import { createAudioAnalysisJob, getAudioAnalysisJob } from '../services/audioAnalyses.js'
import { useEffect, useMemo } from 'react'
import { queryClient } from '../config/queryClient.js'
import { JOB_STATUS } from '@chords-extractor/common/audioAnalysisStatus.js'

export const useCreateAudioAnalysisJobPolling = () => {
  const POLLING_DELAY_MS = 1000
  const { isSuccess: mutationIsSuccess, isPending: mutationIsPending, data: mutationData, error: mutationError, mutate } = useMutation({
    mutationKey: ['job'],
    mutationFn: createAudioAnalysisJob,
    gcTime: 0
  })
  const { data: queryData, error: queryError, refetch } = useQuery({
    queryKey: ['job'],
    queryFn: () => getAudioAnalysisJob({ jobId: mutationData.id }),
    enabled: false,
    refetchInterval: false,
    gcTime: 0, // garbage collected time
    refetchOnWindowFocus: false
  })

  useEffect(() => {
    let refetchTimeoutId
    if (!refetchTimeoutId && checkShouldPolling(mutationData?.status)) {
      refetchTimeoutId = setTimeout(async function polling () {
        const { data: { status } } = await refetch()
        if (checkShouldPolling(status)) refetchTimeoutId = setTimeout(polling, 1000)
      }, POLLING_DELAY_MS)
    }

    return () => {
      if (refetchTimeoutId) clearTimeout(refetchTimeoutId)
    }
  }, [mutationData])

  const runAudioAnalysisJobMutation = ({ youtubeId }) => {
    queryClient.resetQueries({ queryKey: 'job', exact: true }) // reset job query data
    mutate({ youtubeId })
  }

  const checkShouldPolling = (jobStatus) => {
    return mutationIsSuccess &&
    mutationData?.id !== null &&
    [JOB_STATUS.waiting, JOB_STATUS.processing].includes(jobStatus)
  }

  const { jobResult, jobIsFailed, jobIsInQueue, jobIsProcessing, jobIsCompleted, error } = useMemo(() => {
    const job = mutationData !== undefined || queryData !== undefined ? { ...mutationData, ...queryData } : undefined
    const jobIsFailed = job?.status === JOB_STATUS.failed
    const jobIsInQueue = job?.status === JOB_STATUS.waiting
    const jobIsProcessing = job?.status === JOB_STATUS.processing
    const jobIsCompleted = job?.status === JOB_STATUS.completed
    const error = mutationError !== null || queryError !== null ? { ...mutationError, ...queryError } : null
    return { jobResult: job?.result, jobIsFailed, jobIsInQueue, jobIsProcessing, jobIsCompleted, error }
  }, [mutationData, queryData, mutationError, queryError])

  return { jobResult, jobIsFailed, jobIsInQueue, jobIsCompleted, jobIsProcessing, error, createJob: runAudioAnalysisJobMutation, jobCreationIsPending: mutationIsPending }
}
