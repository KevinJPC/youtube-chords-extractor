import './EditPopOver.css'
import { useEffect, useRef } from 'react'
import { AutoComplete } from '../AutoComplete'
import { CheckIcon, PencilIcon, PlayIcon, XMarkIcon } from '../icons'
import { PopOver } from '../PopOver'
import { useEditViewContext } from './Context'
import { useYoutubePlayerContext } from '../YoutubePlayer'
import { useEditedChordsPerBeatsContext } from '../EditedChordsPerBeatsContext'

const Notes = ['A', 'Bb', 'B', 'C', 'C#', 'D', 'D#', 'E']
const Types = ['m', 'maj7', 'dim', 'maj9']

export const EditPopover = () => {
  const { isEditing, isSelecting, currentSelectedElement, resetCurrentSelected, virtualListEl } = useEditViewContext()

  const popOverRef = useRef(null)

  useEffect(() => {
    if (!isSelecting) return
    let { innerWidth } = window
    const onResize = (e) => {
      const { innerWidth: currentInnerWidth } = window
      if (innerWidth !== currentInnerWidth) {
        innerWidth = currentInnerWidth
        resetCurrentSelected()
      }
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [isSelecting])

  useEffect(() => {
    popOverRef.current?.update()
  }, [isEditing])
  return (
    <PopOver
      ref={popOverRef}
      isOpen={isSelecting}
      rootBoundaryEl={virtualListEl}
      boundaryEl='viewport'
      anchorEl={currentSelectedElement}
      offset={4}
      onClose={resetCurrentSelected}
      className='edit-view-popover'
      shouldCloseOnClickOutside={(e) => {
        return !currentSelectedElement.contains(e.target) && e.type !== 'focus'
      }}
      /* auto update doesn't work fine because of the virtual list so the popover
      ** position is updated manually only when the popover content changes */
      autoUpdate={false}
    >
      {!isEditing ? <EditMenu /> : <EditChordForm />}
    </PopOver>
  )
}

const EditMenu = () => {
  const { chordsPerBeats, deleteChordPerBeat } = useEditedChordsPerBeatsContext()
  const { seekTo } = useYoutubePlayerContext()
  const { currentSelectedBeatTimestamp, toggleEditing } = useEditViewContext()
  const handleClickPlay = () => {
    seekTo(currentSelectedBeatTimestamp)
  }
  const handleClickEdit = () => {
    toggleEditing()
  }
  const handleClickDelete = () => {
    deleteChordPerBeat({ timestamp: currentSelectedBeatTimestamp })
  }

  return (
    <>
      <button
        onClick={handleClickPlay}
        className='edit-view-popover__button'
      >
        <PlayIcon />
      </button>
      <button
        onClick={handleClickEdit}
        className='edit-view-popover__button'
      >
        <PencilIcon />
      </button>
      <button
        onClick={handleClickDelete}
        className='edit-view-popover__button'
      >
        <XMarkIcon />
      </button>
    </>
  )
}

const EditChordForm = () => {
  const { chordsPerBeats, editChordPerBeat } = useEditedChordsPerBeatsContext()
  const { toggleEditing, virtualListEl, currentSelectedBeatTimestamp, resetCurrentSelected } = useEditViewContext()
  const handleClickEdit = () => {
    toggleEditing()
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const { root, type, bass } = Array.from(formData.entries()).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
    const chordSymbol = [
      root || '',
      type || '',
      bass ? `/${bass}` : ''
    ].join('')
    editChordPerBeat({ timestamp: currentSelectedBeatTimestamp, chordSymbol })
    resetCurrentSelected()
  }

  const { chord: chordToEdit } = chordsPerBeats.find(({ timestamp }) => timestamp === currentSelectedBeatTimestamp) || {}

  const rootNoteToEdit = [chordToEdit?.rootNote || '', chordToEdit?.signature || ''].join('')
  const typeToEdit = [chordToEdit?.type || '', chordToEdit?.descriptor || ''].join('')
  const bassNoteToEdit = [chordToEdit?.bassNote || ''].join('')

  return (
    <div className='edit-view-popover__form-wrapper'>
      <button
        onClick={handleClickEdit}
        className='edit-view-popover__button'
      >
        <PencilIcon />
      </button>
      <form className='edit-view-popover__form' onSubmit={handleOnSubmit}>
        <AutoComplete initialSuggestedValues={Notes} initialValue={rootNoteToEdit} className='edit-view-popover__autocomplete'>
          <AutoComplete.Input
            name='root'
            label='Root'
            classNames={{ wrapper: 'edit-view-popover__input-wrapper', input: 'edit-view-popover__input', label: 'edit-view-popover__label' }}
          />
          <AutoComplete.Items
            rootBoundaryEl={virtualListEl?.current}
            offset={17}
            classNames={{ wrapper: 'edit-view-popover__suggested-items-wrapper', list: 'edit-view-popover__suggested-items-list' }}
          >
            {((note, { index, isHovered }) => (
              <AutoComplete.Item
                key={index}
                index={index}
                value={note}
                className={`edit-view-popover__suggested-item ${isHovered ? 'edit-view-popover__suggested-item--hovered' : ''}`}
              >{note}
              </AutoComplete.Item>
            ))}
          </AutoComplete.Items>
        </AutoComplete>
        <AutoComplete initialSuggestedValues={Types} initialValue={typeToEdit} className='edit-view-popover__autocomplete'>
          <AutoComplete.Input
            name='type'
            label='Type'
            classNames={{ wrapper: 'edit-view-popover__input-wrapper', input: 'edit-view-popover__input', label: 'edit-view-popover__label' }}
          />
          <AutoComplete.Items
            rootBoundaryEl={virtualListEl?.current}
            offset={17}
            classNames={{ wrapper: 'edit-view-popover__suggested-items-wrapper', list: 'edit-view-popover__suggested-items-list' }}
          >
            {((type, { index, isHovered }) => (
              <AutoComplete.Item
                key={index}
                index={index}
                value={type}
                className={`edit-view-popover__suggested-item ${isHovered ? 'edit-view-popover__suggested-item--hovered' : ''}`}
              >{type}
              </AutoComplete.Item>
            ))}
          </AutoComplete.Items>
        </AutoComplete>
        <AutoComplete initialSuggestedValues={Notes} initialValue={bassNoteToEdit} className='edit-view-popover__autocomplete'>
          <AutoComplete.Input
            name='bass'
            label='Bass'
            classNames={{ wrapper: 'edit-view-popover__input-wrapper', input: 'edit-view-popover__input', label: 'edit-view-popover__label' }}
          />
          <AutoComplete.Items
            rootBoundaryEl={virtualListEl?.current}
            offset={17}
            classNames={{ wrapper: 'edit-view-popover__suggested-items-wrapper', list: 'edit-view-popover__suggested-items-list' }}
          >
            {((bassNote, { index, isHovered }) => (
              <AutoComplete.Item
                key={index}
                index={index}
                value={bassNote}
                className={`edit-view-popover__suggested-item ${isHovered ? 'edit-view-popover__suggested-item--hovered' : ''}`}
              >{bassNote}
              </AutoComplete.Item>
            ))}
          </AutoComplete.Items>
        </AutoComplete>
        <button className='edit-view-popover__button'>
          <CheckIcon />
        </button>
      </form>
    </div>
  )
}
