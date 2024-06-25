import { createContext, useCallback, useContext, useDeferredValue, useRef, useState } from 'react'
import './YoutubePlayer.css'
import { Spinner } from './Spinner'
import { BackWardIcon, PauseIcon, PlayIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from './icons'
import { useLoadYoutubeApi } from '../hooks/useLoadYoutubeApi'
import { getYoutubeMaxResDefaultThumbnailById } from '../utils/getYoutubeThumbnailById'

export const PLAYER_STATUS = {
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  ENDED: 'ENDED',
  UNSTARDED: 'UNSTARTED'
}

const initialPlayerState = {
  isReady: false,
  status: PLAYER_STATUS.UNSTARDED,
  currentTime: 0,
  duration: null,
  volume: { current: 75, previous: 75 },
  showIframe: false
}

const UPDATE_CURRENT_TIME_FREQUENCY_MS = 100

const YoutubePlayerContext = createContext({
  ...initialPlayerState,
  togglePlay: () => {}
})

export const useYoutubePlayerContext = () => useContext(YoutubePlayerContext)

export const YoutubePlayerProvider = ({ children }) => {
  const playerRef = useRef(null)
  const currentTimeIntervalUpdaterIdRef = useRef(null)

  const [{ isReady, showIframe, status, currentTime, duration, volume: { current: currentVolume, previous: previousVolume } }, setPlayerState] = useState(initialPlayerState)
  const deferredCurrentTime = useDeferredValue(currentTime)
  const isPlaying = status === PLAYER_STATUS.PLAYING

  const updatePlayerState = (newState) => {
    setPlayerState((prev) => ({ ...prev, ...newState }))
  }

  const clearCurrentTimeIntervalUpdater = () => {
    if (currentTimeIntervalUpdaterIdRef.current) currentTimeIntervalUpdaterIdRef.current = clearInterval(currentTimeIntervalUpdaterIdRef.current)
  }

  const startCurrentTimeIntervalUpdater = () => {
    function updateTime () {
      updatePlayerState({ currentTime: playerRef.current?.getCurrentTime() })
    }
    currentTimeIntervalUpdaterIdRef.current = setInterval(updateTime, UPDATE_CURRENT_TIME_FREQUENCY_MS)
  }

  useLoadYoutubeApi((YT) => {
    playerRef.current = new YT.Player('youtube-player', {
      events: {
        onReady: (e) => {
          playerRef.current.setVolume(currentVolume)
          updatePlayerState({ isReady: true, duration: playerRef.current.getDuration() })
        },
        // hidding and showing iframe when video starts and ends help to avoid youtube branding but is not 100% effective
        onStateChange: e => {
          /* Clear interval and hide iframe when the video ends. Also, set current time to infinity to ensure the last beat is reached.
          /* This is necessary because video duration is not always exact; it can vary by a few seconds,
          /* but the difference between each beat of a song is often a matter of milliseconds.
          */
          if (e.data === 0) {
            clearCurrentTimeIntervalUpdater()
            updatePlayerState({ status: PLAYER_STATUS.ENDED, showIframe: false, currentTime: Infinity })
          }
          // Show iframe when the video really starts playing
          if (e.data === 1) {
            updatePlayerState({ showIframe: true })
            startCurrentTimeIntervalUpdater()
          }
          // Update status and clear the interval when closing the picture-in-picture player in some browsers or when the app is left on mobile
          if (e.data === 2) {
            clearCurrentTimeIntervalUpdater()
            updatePlayerState({ status: PLAYER_STATUS.PAUSED })
          }
        }
      }
    })
    return () => {
      clearCurrentTimeIntervalUpdater()
      if (playerRef.current) {
        playerRef.current.destroy()
        playerRef.current = null
      }
    }
  })

  const togglePlay = () => {
    if (!isReady) return
    if (status === PLAYER_STATUS.PLAYING) {
      clearCurrentTimeIntervalUpdater()
      playerRef.current.pauseVideo()
      updatePlayerState({ status: PLAYER_STATUS.PAUSED })
    } else {
      playerRef.current.playVideo()
      updatePlayerState({ status: PLAYER_STATUS.PLAYING, currentTime: playerRef.current.getCurrentTime() })
    }
  }

  const seekTo = useCallback((time) => {
    if (!isReady) return
    clearCurrentTimeIntervalUpdater()
    playerRef.current.seekTo(time)
    updatePlayerState({ status: PLAYER_STATUS.PLAYING, currentTime: time })
    if (status === PLAYER_STATUS.PAUSED) playerRef.current.playVideo()
  }, [isReady, status, clearCurrentTimeIntervalUpdater, updatePlayerState, playerRef.current])

  const setVolume = (newCurrentVolume) => {
    if (!isReady) return
    playerRef.current.setVolume(newCurrentVolume)
    updatePlayerState({ volume: { current: newCurrentVolume, previous: currentVolume } })
  }

  return (
    <YoutubePlayerContext.Provider value={{
      isReady,
      status,
      duration,
      currentTime: deferredCurrentTime,
      currentVolume,
      previousVolume,
      togglePlay,
      isPlaying,
      setVolume,
      seekTo,
      showIframe
    }}
    >
      {children}
    </YoutubePlayerContext.Provider>
  )
}

export const YoutubePlayer = ({ youtubeId, className = '', thumbnailUrl = getYoutubeMaxResDefaultThumbnailById(youtubeId) }) => {
  const { status, isReady, showIframe } = useContext(YoutubePlayerContext)

  const showPoster = status !== PLAYER_STATUS.UNSTARDED
  return (

    <div className={`player ${className}`}>
      <iframe
        id='youtube-player'
        className={`player__iframe ${showIframe ? 'player__iframe--playing' : ''}`}
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?playsinline=1&controls=0&disablekb=1&fs=0&enablejsapi=1&origin=${window.location.origin}&rel=0&iv_load_policy=3`}
        title='YouTube video player'
        allow='autoplay'
        referrerPolicy='strict-origin-when-cross-origin'
        tabIndex='-1'
      />
      <picture id='player-poster' className={`player__poster ${showPoster ? 'player__poster--hide' : ''}`}>
        <img className='player__poster-img' fetchpriority='high' src={thumbnailUrl} />
      </picture>

      {isReady && <CustomPlayerControls />}

      {!isReady && <Spinner className='player__spinner' size={48} thickness={4} />}
    </div>
  )
}

const MAX_IDLE_TIME_ON_HOVERING_CONTROLS_MS = 2000

const CustomPlayerControls = () => {
  const {
    status,
    togglePlay
  } = useContext(YoutubePlayerContext)

  const updateIsHoveringTimeoutIdRef = useRef(null)

  const [isHovering, setIsHovering] = useState(false)

  const updateIsHovering = (newState) => {
    setIsHovering(newState)
    if (newState === true) {
      updateIsHoveringTimeoutIdRef.current = clearInterval(updateIsHoveringTimeoutIdRef.current)
      updateIsHoveringTimeoutIdRef.current = setTimeout(() => setIsHovering(false), MAX_IDLE_TIME_ON_HOVERING_CONTROLS_MS)
    }
  }

  const handlePointerMove = () => {
    updateIsHovering(true)
  }

  const handleMouseLeave = () => {
    updateIsHovering(false)
  }

  const handleOnClick = () => {
    updateIsHovering(true)
    togglePlay()
  }
  const isPlaying = status === PLAYER_STATUS.PLAYING
  const controlsAreHidden = !isHovering && isPlaying

  return (

    <div
      className={`player__controls ${controlsAreHidden ? 'player__controls--hiden' : ''}`}
      onPointerMove={handlePointerMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleOnClick}
    >
      <div className='player__controls-group player__controls-group--center'>
        <TogglePlayButton className='player__toggle-play-button' />
      </div>
    </div>
  )
}

export const TogglePlayButton = ({ className = '' }) => {
  const {
    isPlaying,
    togglePlay
  } = useYoutubePlayerContext()
  return (
    <button className={`${className}`} onClick={togglePlay}>
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </button>
  )
}

export const SeekToStartButton = ({ className = '' }) => {
  const { seekTo } = useYoutubePlayerContext()
  return (
    <button className={`${className}`} onClick={() => seekTo(0)}>
      <BackWardIcon />
    </button>
  )
}

export const MuteButton = ({ className }) => {
  const { currentVolume, previousVolume, setVolume } = useYoutubePlayerContext()
  const isMuted = currentVolume === 0
  const handleOnClick = () => {
    const newCurrentVolume = isMuted ? previousVolume : 0
    setVolume(newCurrentVolume)
  }
  return (
    <button
      className={`${className}`}
      onClick={handleOnClick}
    >
      {isMuted ? <SpeakerXMarkIcon /> : <SpeakerWaveIcon />}
    </button>
  )
}

export const VolumeSlider = ({ className }) => {
  const { currentVolume, setVolume } = useYoutubePlayerContext()

  const handleOnChange = (e) => setVolume(Number(e.target.value))

  /* fix a bug in chrome
  ** https://stackoverflow.com/questions/69490604/html-input-range-type-becomes-un-usable-by-drag-action-if-highlighted-in-chrome
  */
  const handleOnDragStart = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <input
      type='range'
      min={0}
      max={100}
      value={currentVolume}
      step={1}
      onChange={handleOnChange}
      onDragStart={handleOnDragStart}
    />
  )
}
