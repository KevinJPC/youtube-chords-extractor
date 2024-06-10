import { useEffect } from 'react'
import { LoadYoutubeApi } from '../utils/loadYoutubeApi'

export const useLoadYoutubeApi = (onLoadedCallback) => {
  useEffect(() => {
    let isComponentMounted = true
    let cleanUpFn
    const initPlayer = async () => {
      const YT = await LoadYoutubeApi()
      if (!isComponentMounted) return
      cleanUpFn = onLoadedCallback(YT)
    }
    initPlayer()
    return () => {
      isComponentMounted = false
      if (cleanUpFn && cleanUpFn instanceof Function) {
        cleanUpFn()
      }
    }
  }, [])
}
