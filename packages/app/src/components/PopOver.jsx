import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react-dom'
import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { useInteractWithOutside } from '../hooks/useClickOutside'

export const PopOver = forwardRef(({
  isOpen,
  anchorEl,
  onClose,
  rootBoundaryEl,
  boundaryEl,
  offset: mainAxis = 0,
  placement = 'bottom',
  children,
  className,
  shouldCloseOnClickOutside = () => true,
  style,
  strategy = 'absolute',
  flipMainAxis = true,
  shiftMainAxis = true,
  autoUpdate: autoUpdateProp = true,
  ...props
}, ref) => {
  const { refs, floatingStyles, update } = useFloating({
    open: isOpen,
    strategy,
    placement,
    elements: {
      reference: anchorEl ?? undefined
    },
    whileElementsMounted: (reference, floating, update) => {
      if (autoUpdateProp) {
        return autoUpdate(reference, floating, update)
      } else {
        update()
      }
    },
    middleware: [
      offset({
        mainAxis
      }),
      flip({
        mainAxis: flipMainAxis,
        rootBoundary: rootBoundaryEl ?? 'viewport',
        boundary: boundaryEl ?? undefined

      }),
      shift({
        mainAxis: shiftMainAxis,
        rootBoundary: rootBoundaryEl ?? 'viewport',
        boundary: boundaryEl ?? undefined
      })
    ]
  })

  useImperativeHandle(ref, () => {
    return {
      update
    }
  })

  useInteractWithOutside({
    element: refs.floating?.current,
    onClick: (e) => {
      if (shouldCloseOnClickOutside instanceof Function && shouldCloseOnClickOutside(e)) {
        onClose?.()
      }
    }
  })

  if (!isOpen) return null
  return (
    <div
      ref={(instance) => {
        refs.setFloating(instance)
        // if (ref) ref.current = instance
      }}
      style={{
        ...style,
        ...floatingStyles
      }}
      className={`${className}`}
      {...props}
    >
      {children}
    </div>
  )
})
