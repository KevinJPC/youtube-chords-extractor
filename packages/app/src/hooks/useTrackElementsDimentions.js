import { useEffect } from 'react'

export const useTrackElementsDimentions = ({ elementsRefs = [], onDimentionsChange, deps = [] }) => {
  useEffect(() => {
    const onResize = () => {
      if (elementsRefs.length === 0) return
      const newDimentions = elementsRefs.map((ref) => {
        const { height = 0, width = 0 } = ref.current?.getBoundingClientRect?.() || {}
        return { height, width }
      })
      onDimentionsChange(newDimentions)
    }
    onResize()
    window.document.fonts.addEventListener('loadingdone', onResize)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.document.fonts.removeEventListener('loadingdone', onResize)
    }
  }, [...deps])
}
