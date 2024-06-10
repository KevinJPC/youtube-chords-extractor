import { queryClient } from '../config/queryClient.js'

export const useUpdateSearchYoutubeQueryData = (q) => {
  const updateResult = ({ youtubeId, data }) => {
    const searchData = queryClient.getQueryData(['search', q])

    for (let resultIndex = 0; resultIndex < searchData.length; resultIndex++) {
      const result = searchData[resultIndex]
      if (result.youtubeId === youtubeId) {
        searchData[resultIndex] = {
          ...result,
          ...data
        }
        return
      }
    }
  }
  return { updateResult }
}
