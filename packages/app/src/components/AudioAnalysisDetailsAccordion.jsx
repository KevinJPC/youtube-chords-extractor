import { useState } from 'react'
import './AudioAnalysisDetailsAccordion.css'

export const AudioAnalysisDetailsAccordion = ({ className = '', chordsSummary, bpm, sessions, editedBy, modifiedAt }) => {
  const [showDetails, setShowDetails] = useState(false)
  const toggleDetails = () => setShowDetails(prev => !prev)

  return (
    <aside
      className={`audio-analysis-details-accordion ${!showDetails ? 'audio-analysis-details-accordion--hidden' : ''} ${className}`}
      onClick={() => {
        if (showDetails) return
        toggleDetails()
      }}
    >
      <div className='audio-analysis-details-accordion__wrapper'>
        <div className='audio-analysis-details-accordion__primary-info'>
          <span className='audio-analysis-details-accordion__chords-summary'>{chordsSummary}</span>
          <span className='audio-analysis-details-accordion__bpm'>{bpm} bpm</span>
          <span className='audio-analysis-details-accordion__sessions'>{bpm} bpm</span>
        </div>
        <div className='audio-analysis-details-accordion__secondary-info'>
          <span className='audio-analysis-details-accordion__edited-by'>Edited by {editedBy}</span>
          <span className='audio-analysis-details-accordion__modified-at'>Last modified on {modifiedAt}</span>
        </div>
      </div>
      <button
        className='audio-analysis-details-accordion__toggle-button'
        onClick={(e) => {
          e.stopPropagation()
          toggleDetails()
        }}
      >
        {showDetails ? 'Show less' : 'Show more'}
      </button>
    </aside>
  )
}
