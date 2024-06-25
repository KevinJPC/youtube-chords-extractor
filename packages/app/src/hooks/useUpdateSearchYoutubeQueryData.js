import { queryClient } from '../config/queryClient.js'

export const useUpdateSearchYoutubeQueryData = () => {
  const updateResult = ({ q, youtubeId, data }) => {
    const searchData = queryClient.getQueryData(['search', q])
    for (let resultIndex = 0; resultIndex < searchData.results.length; resultIndex++) {
      const result = searchData.results[resultIndex]
      if (result.youtubeId === youtubeId) {
        searchData.results[resultIndex] = {
          ...result,
          ...data
        }
        return
      }
    }
  }
  return { updateResult }
}
