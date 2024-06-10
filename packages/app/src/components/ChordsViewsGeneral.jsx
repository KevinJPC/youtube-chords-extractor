import './ChordsViewsGeneral.css'
import { checkIsCurrentChord } from '../utils/checkIsCurrentChord'
import { MemoizedChord } from './Chord'
import { useCustomizedChordsPerBeatsContext } from './CustomizedChordsPerBeatsContext'
import { VirtualRowsChordsGrid } from './VirtualRowsChordsGrid'
import { MuteButton, SeekToStartButton, TogglePlayButton, VolumeSlider, useYoutubePlayerContext } from './YoutubePlayer'
import { KeyTransposer } from './KeyTransposer'
import { useCallback } from 'react'
import { Toolbar } from './Toolbar'

export const GeneralView = ({ className }) => {
  const { chordsPerBeats } = useCustomizedChordsPerBeatsContext()
  const chordsPerBeatsLastIndex = chordsPerBeats.length - 1
  const { currentTime, seekTo } = useYoutubePlayerContext()

  const handleOnClickChord = useCallback((e) => {
    const timestamp = Number(e.currentTarget.dataset.timestamp)
    seekTo(timestamp)
  }, [seekTo])

  if (chordsPerBeats.length === 0) return null
  return (
    <VirtualRowsChordsGrid
      className={className}
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
            data-timestamp={timestamp}
          />
        )
      }}
    />
  )
}

export const GeneralToolbar = () => {
  return (
    <Toolbar>
      <Toolbar.Option>
        <SeekToStartButton className='general-toolbar__player-buttons' />
      </Toolbar.Option>
      <Toolbar.Option>
        <TogglePlayButton className='general-toolbar__player-buttons' />
      </Toolbar.Option>
      <Toolbar.Option>
        <div className='general-toolbar__volume-control'>
          <MuteButton className='general-toolbar__player-buttons' />
          <VolumeSlider />
        </div>
      </Toolbar.Option>
      <Toolbar.Option>
        <KeyTransposer />
      </Toolbar.Option>
      <Toolbar.Option>A</Toolbar.Option>
      <Toolbar.Option>B</Toolbar.Option>
      <Toolbar.Option>C</Toolbar.Option>
      <Toolbar.Option>A</Toolbar.Option>
      <Toolbar.Option>B</Toolbar.Option>
      <Toolbar.Option>C</Toolbar.Option>
      <Toolbar.Option>A</Toolbar.Option>
      <Toolbar.Option>B</Toolbar.Option>
      <Toolbar.Option>C</Toolbar.Option>
    </Toolbar>

  )
}
