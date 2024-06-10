import { useEffect } from 'react'

export const useInteractWithOutside = ({ element, onClick: onClickCb }) => {
  useEffect(() => {
    if (!element) return
    const onClick = (e) => {
      if (!element.contains(e.target)) {
        onClickCb?.(e)
      }
    }
    document.addEventListener('click', onClick, { capture: true })
    document.addEventListener('focus', onClick, { capture: true })
    return () => {
      document.removeEventListener('click', onClick, { capture: true })
      document.removeEventListener('focus', onClick, { capture: true })
    }
  }, [element])
}
