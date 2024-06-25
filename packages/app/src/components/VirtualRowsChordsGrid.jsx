import './VirtualRowsChordsGrid.css'
import { useWindowVirtualizer } from '@tanstack/react-virtual'
import React, { forwardRef, useContext, useRef, createContext } from 'react'

export const VirtualRowsChordsGrid = forwardRef(({
  className = '',
  chordsPerBeats,
  maxItemsPerVirtualRow = 128,
  itemContent,
  beatsPerBar = 4,
  initialOffset,
  initialMeasurementsCache,
  onChange,
  overscan = 2
}, ref) => {
  const listRef = useRef(null)
  const count = Math.ceil(chordsPerBeats.length / maxItemsPerVirtualRow)
  const virtualizer = useWindowVirtualizer({
    count,
    estimateSize: () => 200,
    overscan,
    scrollMargin: listRef.current?.offsetTop ?? 0,
    // scrollMargin: listRef.current?.offsetTop ? listRef.current.offsetTop - 100 : 0,
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
      {items.map(({ key: rowKey, index: rowIndex, start }) => {
        const rowStartIndex = rowIndex * maxItemsPerVirtualRow
        const rowEndIndex = Math.min(rowStartIndex + maxItemsPerVirtualRow, chordsPerBeats.length)
        const totalColumns = rowEndIndex - rowStartIndex
        return (
          <div
            key={rowKey}
            data-index={rowIndex}
            ref={virtualizer.measureElement}
            style={{
              position: 'absolute',
              inset: '0 0 auto',
              top: `${start - virtualizer.options.scrollMargin}px`
            }}
            className={`chords-row chords-row--${beatsPerBar}-beat-bar`}
          >
            {Array(totalColumns).fill(null).map((_, columnIndex) => {
              const currentIndex = rowStartIndex + columnIndex
              const currentChord = chordsPerBeats[currentIndex]
              return itemContent(currentIndex, currentChord)
            }
            )}
          </div>
        )
      })}
    </div>
  )
})

export const Chord = ({ rootNote, signature, type, descriptor, bassNote, isCurrent, onClick = () => {}, isEditing, onDoubleClick = () => {}, ...props }) => {
  return (
    <li
      className={`chord chords-row__chord ${isCurrent ? 'chord--current' : ''} ${isEditing ? 'chord--editing' : ''}`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      {...props}
    >
      {rootNote &&
        <div className={`chords__wrapper ${bassNote ? 'bass-note-divisor' : ''}`}>
          <div>
            <span>{rootNote}</span>
            {signature && <span className='chords__signature'>{signature}</span>}
            {type && <span className='chords__type'>{type}</span>}
            {descriptor && <span className='chords__descriptor'>{descriptor}</span>}
          </div>
          {bassNote && <span className='chords__bass-note'>{bassNote}</span>}
        </div>}
    </li>
  )
}

export const MemoizedChord = React.memo(Chord)

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
