import { createContext, useCallback, useContext, useState } from 'react'
import { processArrayNonBlocking } from '../utils/processArrayNonBlocking'
import { chordParserFactory, chordRendererFactory } from 'chord-symbol'
import { createChordParser, createChordRenderer, getChordInfoFromRenderedChord } from '@chords-extractor/common/chords.js'

const CustomizedChordsPerBeatsContext = createContext({
  simplify: false,
  transposeValue: 0,
  chordsPerBeats: []
})

export const useCustomizedChordsPerBeatsContext = () => useContext(CustomizedChordsPerBeatsContext)

export const CustomizedChordsPerBeatsProvider = ({ children, initialChordsPerBeats }) => {
  const [{ simplify, transposeValue, chordsPerBeats }, setState] = useState({
    simplify: false,
    transposeValue: 0,
    chordsPerBeats: initialChordsPerBeats
  })

  const updateState = (newState) => setState(prev => ({ ...prev, ...newState }))

  const increaseTransposeValue = () => {
    const newTransposeValue = transposeValue + 1
    processChords({ transposeValue: newTransposeValue })
    updateState({ transposeValue: newTransposeValue })
  }

  const decreaseTransposeValue = () => {
    const newTransposeValue = transposeValue - 1
    processChords({ transposeValue: newTransposeValue })
    updateState({ transposeValue: newTransposeValue })
  }

  const toggleSimplify = () => {
    const newSimplify = !simplify
    updateState({ simplify: newSimplify })
    processChords({ transposeValue, simplify: newSimplify })
  }

  const processChords = useCallback(async ({ transposeValue, simplify }) => {
    processArrayNonBlocking.cancel?.()

    const parseChord = createChordParser(chordParserFactory)
    const renderChord = createChordRenderer(chordRendererFactory, { simplify, transposeValue })
    const newChordPerBeats = await processArrayNonBlocking(initialChordsPerBeats, (chordPerBeat) => {
      const chordSymbol = chordPerBeat?.chord?.symbol
      if (!chordSymbol) return { ...chordPerBeat, chord: null }

      const parsedChord = parseChord(chordSymbol)
      if (parseChord.error) return { ...chordPerBeat, chord: null }

      const renderedChord = renderChord(parsedChord)
      const chordInfo = getChordInfoFromRenderedChord(renderedChord)

      return { ...chordPerBeat, chord: chordInfo }
    }).catch(_ => {})

    if (newChordPerBeats) updateState({ chordsPerBeats: newChordPerBeats })
  }, [])

  return (
    <CustomizedChordsPerBeatsContext.Provider value={{
      simplify,
      transposeValue,
      increaseTransposeValue,
      decreaseTransposeValue,
      toggleSimplify,
      chordsPerBeats
    }}
    >
      {children}
    </CustomizedChordsPerBeatsContext.Provider>
  )
}
