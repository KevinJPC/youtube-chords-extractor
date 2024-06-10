import { createContext, useContext, useState } from 'react'
import { createChordParser, createChordRenderer, getChordInfoFromRenderedChord } from '@chords-extractor/common/chords.js'
import { chordParserFactory, chordRendererFactory } from 'chord-symbol'

const EditedChordsPerBeatsContext = createContext({
  chordsPerBeats: [],
  editChordPerBeat: () => {},
  deleteChordPerBeat: () => {}
})

export const useEditedChordsPerBeatsContext = () => useContext(EditedChordsPerBeatsContext)

export const EditedChordsPerBeatsProvider = ({ children, initialChordsPerBeats }) => {
  const [{ chordsPerBeats }, setState] = useState({ chordsPerBeats: initialChordsPerBeats })

  const updateState = (newState) => {
    setState(prev => ({ ...prev, ...newState }))
  }

  const editChordPerBeat = ({ chordSymbol, timestamp }) => {
    const currentChordPerBeatToModifyIndex = chordsPerBeats.findIndex(({ timestamp: t }) => t === timestamp)
    if (!currentChordPerBeatToModifyIndex) return
    const currentChordPerBeatToModify = chordsPerBeats[currentChordPerBeatToModifyIndex]
    const currentChordSymbolToModify = currentChordPerBeatToModify.chord?.symbol

    const parseChord = createChordParser(chordParserFactory)
    const parsedChord = parseChord(chordSymbol)
    if (parsedChord.error) return null

    const renderChord = createChordRenderer(chordRendererFactory)
    const renderedChord = renderChord(parsedChord)

    const chordInfo = getChordInfoFromRenderedChord(renderedChord)

    if (chordInfo === null || chordInfo.symbol === currentChordSymbolToModify) return

    const newEditedChordsPerBeats = [...chordsPerBeats]
    newEditedChordsPerBeats[currentChordPerBeatToModifyIndex] = { ...currentChordPerBeatToModify, chord: chordInfo }

    updateState({ chordsPerBeats: newEditedChordsPerBeats })
  }

  const deleteChordPerBeat = ({ timestamp }) => {
    const currentChordPerBeatToModifyIndex = chordsPerBeats.findIndex(({ timestamp: t }) => t === timestamp)
    if (!currentChordPerBeatToModifyIndex) return
    const currentChordPerBeatToModify = chordsPerBeats[currentChordPerBeatToModifyIndex]
    if (!currentChordPerBeatToModify || !currentChordPerBeatToModify?.chord) return
    const newChordPerBeat = { ...currentChordPerBeatToModify, chord: null }
    const newEditedChordsPerBeats = [...chordsPerBeats]
    newEditedChordsPerBeats[currentChordPerBeatToModifyIndex] = newChordPerBeat
    updateState({ chordsPerBeats: newEditedChordsPerBeats })
  }
  return (
    <EditedChordsPerBeatsContext.Provider value={{ chordsPerBeats, editChordPerBeat, deleteChordPerBeat }}>
      {children}
    </EditedChordsPerBeatsContext.Provider>
  )
}
