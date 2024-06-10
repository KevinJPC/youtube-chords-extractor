import './VirtualRowsChordsGrid.css'
import { useWindowVirtualizer } from '@tanstack/react-virtual'
import React, { forwardRef, useContext, useRef, createContext } from 'react'

export const VirtualRowsChordsGrid = forwardRef(({
  className = '',
  chordsPerBeats,
  maxItemsPerVirtualRow,
  itemContent,
  beatsPerBar = 4,
  initialOffset,
  initialMeasurementsCache,
  onChange
}, ref) => {
  const listRef = useRef(null)
  const count = Math.ceil(chordsPerBeats.length / maxItemsPerVirtualRow)
  const virtualizer = useWindowVirtualizer({
    count,
    estimateSize: () => 200,
    overscan: 0,
    // scrollMargin: listRef.current?.offsetTop ? listRef.current.offsetTop - 100 : 0,
    scrollMargin: listRef.current?.offsetTop ?? 0,
    initialOffset: initialOffset || undefined,
    initialMeasurementsCache: initialMeasurementsCache || undefined,
    gap: 4,
    onChange: (instance, sync) => {
      onChange?.(instance)
      // console.log(instance.measurementsCache)
      // console.log(instance.scrollOffset)
    }
  })
  const items = virtualizer.getVirtualItems()
  const totalSize = virtualizer.getTotalSize()

  return (
    <div
      className={`${className}`}
      ref={(instance) => {
        listRef.current = instance
        if (ref) ref.current = instance
      }}
      style={{
        height: `${totalSize}px`,
        width: '100%',
        position: 'relative'
      }}
    >
      {items.map(({ key: rowKey, index: rowIndex, start }) => (
        <div
          key={rowKey}
          data-index={rowIndex}
          ref={virtualizer.measureElement}
          style={{
            position: 'absolute',
            inset: '0 0 auto',
            top: `${start - virtualizer.options.scrollMargin}px`
            // transform: `translateY(${start - virtualizer.options.scrollMargin}px)`
          }}
          className={`chords-row chords-row--${beatsPerBar}-beat-bar`}
        >
          {Array(maxItemsPerVirtualRow).fill(null).map((_, columnIndex) => {
            const currentIndex = rowIndex * maxItemsPerVirtualRow + columnIndex
            const currentChord = chordsPerBeats[currentIndex]
            if (currentChord === undefined) return null
            return (
              <div
                className='chords-row__chord' key={currentIndex}
              >
                {itemContent(currentIndex, currentChord)}
              </div>
            )
          }
          )}
        </div>
      ))}
    </div>
  )
})

const SharedVirtualChordsListScrollContext = createContext({
  getScrollOffset: () => null,
  getMeasurementsCache: () => null,
  updateSharedVirtualChordsListScrollContext: () => {}
})

export const useSharedVirtualChordListScrollContext = () => useContext(SharedVirtualChordsListScrollContext)

export const SharedVirtualChordsListScrollProvider = ({ children }) => {
  const sharedVirtualChordListScrollRef = useRef({
    scrollOffset: null,
    measurementsCache: null
  })

  const getScrollOffset = () => sharedVirtualChordListScrollRef.current.scrollOffset
  const getMeasurementsCache = () => sharedVirtualChordListScrollRef.current.measurementsCache
  const resetSharedVirtualChordsListScroll = () => {
    sharedVirtualChordListScrollRef.current = { scrollOffset: null, measurementsCache: null }
  }

  const updateSharedVirtualChordsListScrollContext = (scrollOffset, measurementsCache) => {
    sharedVirtualChordListScrollRef.current = { scrollOffset, measurementsCache }
  }

  return (
    <SharedVirtualChordsListScrollContext.Provider value={{ getScrollOffset, getMeasurementsCache, updateSharedVirtualChordsListScrollContext, resetSharedVirtualChordsListScroll }}>
      {children}
    </SharedVirtualChordsListScrollContext.Provider>
  )
}
