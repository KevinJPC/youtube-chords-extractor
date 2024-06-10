import { useQuery } from '@tanstack/react-query'
import { getYoutubeResultsWithAnalyzeStatus } from '../services/audioAnalyses'

export const useSearchYoutubeQuery = (q) => {
  const { isLoading, data, error } = useQuery({
    queryKey: ['search', q],
    queryFn: () => getYoutubeResultsWithAnalyzeStatus({ q }),
    enabled: !!q,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false
  })
  const results = data?.results || []

  return { results, isLoading, error }
}
