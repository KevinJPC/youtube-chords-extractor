import { createContext, forwardRef, useContext, useEffect } from 'react'
import './Modal.css'
import { createPortal } from 'react-dom'
import { XMarkIcon } from './icons'

const ModalContext = createContext({
  handleOnClose: () => {}
})

const useModalContext = () => useContext(ModalContext)

export const Modal = forwardRef(({ children, isOpen, onClose, classNames: { wrapper = '', modal = '', backdrop = '' } = {} }, ref) => {
  const handleOnClose = (e) => {
    onClose?.()
  }

  useEffect(() => {
    if (isOpen) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollBarWidth}px`
    } else {
      document.body.style.overflow = 'auto'
      document.body.style.paddingRight = '0'
    }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <ModalContext.Provider value={{ handleOnClose }}>
      <div className={`modal-wrapper ${wrapper}`} ref={ref}>
        <div
          className={`modal-backdrop ${backdrop}`}
          onClickCapture={handleOnClose}
        />
        <section className={`modal ${modal}`}>
          {children}
        </section>
      </div>
    </ModalContext.Provider>
    , document.body)
})

Modal.Header = ({ children, className = '' }) => {
  return (
    <header className={`modal__header ${className}`}>
      {children}
    </header>
  )
}

Modal.Body = ({ children, className = '' }) => {
  return (
    <div className={`modal__body ${className}`}>
      {children}
    </div>
  )
}

Modal.Footer = ({ children, className = '' }) => {
  return (
    <footer className={`modal__footer ${className}`}>
      {children}
    </footer>
  )
}

Modal.CancelButton = ({ children, className = '' }) => {
  const { handleOnClose } = useModalContext()
  return (
    <button
      className={`modal__cancel-button ${className}`}
      onClick={handleOnClose}
    >
      {children}
    </button>
  )
}

Modal.ConfirmButton = ({ children, className = '', onClick }) => {
  return (
    <button
      className={`modal__confirm-button ${className}`}
      onClick={() => onClick?.()}
    >
      {children}
    </button>
  )
}

Modal.CloseButton = ({ className }) => {
  const { handleOnClose } = useModalContext()
  return (
    <button
      className={`modal__close-button ${className}`}
      onClick={handleOnClose}
    >
      <XMarkIcon />
    </button>
  )
}
