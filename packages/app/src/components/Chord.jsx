import React from 'react'
import './Chord.css'
export const Chord = ({ rootNote, signature, type, descriptor, bassNote, isCurrent, onClick, isEditing, onDoubleClick, ...props }) => {
  return (
    <div
      className={`chord ${isCurrent ? 'chord--current' : ''} ${isEditing ? 'chord--editing' : ''}`} tabIndex={1}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      {...props}
    >
      {rootNote &&
        <div className={`chord-wrapper ${bassNote ? 'bass-note-divisor' : ''}`}>
          <div className='chords__top'>
            <span className='chords__root-note'>{rootNote}</span>
            <span className='chords__signature'>{signature}</span>
            <span className='chords__type'>{type}</span>
            <span className='chords__descriptor'>{descriptor}</span>
          </div>
          {bassNote && <span className='chords__bass-note'>{bassNote}</span>}
        </div>}
    </div>
  )
}

export const MemoizedChord = React.memo(Chord)
