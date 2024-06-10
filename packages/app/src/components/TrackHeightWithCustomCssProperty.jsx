import React, { useEffect, useRef } from 'react'

export const TrackHeightWithCustomCssProperty = ({ children, propertyName }) => {
  const ref = useRef(null)
  useEffect(() => {
    const onResize = () => {
      document.documentElement.style.setProperty(propertyName, `${ref.current.getBoundingClientRect().height}px`)
    }
    onResize()
    window.document.fonts.addEventListener('loadingdone', onResize)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.document.fonts.removeEventListener('loadingdone', onResize)
    }
  }, [])
  return React.cloneElement(children, { ref })
}
