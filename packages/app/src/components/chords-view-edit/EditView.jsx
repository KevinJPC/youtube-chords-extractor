import { useCallback } from 'react'
import { VirtualRowsChordsGrid, MemoizedChord } from '../VirtualRowsChordsGrid'
import { EditPopover } from './EditPopOver'
import { checkIsCurrentChord } from '../../utils/checkIsCurrentChord'
import { useYoutubePlayerContext } from '../YoutubePlayer'
import { useEditViewContext } from './Context'
import { useEditedChordsPerBeatsContext } from '../EditedChordsPerBeatsContext'

export const EditView = () => {
  const { currentTime } = useYoutubePlayerContext()
  const { chordsPerBeats } = useEditedChordsPerBeatsContext()
  const { resetCurrentSelected, setCurrentSelected, currentSelectedBeatTimestamp } = useEditViewContext()

  const chordsPerBeatsLastIndex = chordsPerBeats.length - 1

  const handleOnClickChord = useCallback((e) => {
    const element = e.currentTarget
    const timestamp = Number(element.dataset.timestamp)
    if (currentSelectedBeatTimestamp === timestamp) return resetCurrentSelected()
    setCurrentSelected({ element, timestamp })
  }, [setCurrentSelected])

  const handleOnDoubleClick = useCallback((e) => {
    const element = e.currentTarget
    const timestamp = Number(element.dataset.timestamp)
    setCurrentSelected({ element, timestamp, isEditing: true })
  }, [setCurrentSelected])

  if (chordsPerBeats.length === 0) return null
  return (
    <>
      <VirtualRowsChordsGrid
        ref={null}
        chordsPerBeats={chordsPerBeats}
        maxItemsPerVirtualRow={32}
        itemContent={(index, { chord, timestamp }) => {
          const nextTimestamp = chordsPerBeats[index + 1]?.timestamp
          const isCurrent = checkIsCurrentChord({
            currentIndex: index,
            lastIndex: chordsPerBeatsLastIndex,
            currentTime,
            timestamp,
            nextTimestamp
          })
          const isEditing = currentSelectedBeatTimestamp === timestamp
          const { rootNote, signature, type, descriptor, bassNote } = chord || {}
          return (
            <MemoizedChord
              rootNote={rootNote}
              signature={signature}
              type={type}
              descriptor={descriptor}
              bassNote={bassNote}
              isCurrent={isCurrent}
              onClick={handleOnClickChord}
              onDoubleClick={handleOnDoubleClick}
              data-timestamp={timestamp}
              isEditing={isEditing}
            />
          )
        }}
      />
      <EditPopover />
    </>
  )
}
