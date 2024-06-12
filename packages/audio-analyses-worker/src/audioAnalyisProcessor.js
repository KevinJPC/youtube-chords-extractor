import chordSymbol from 'chord-symbol/lib/chord-symbol.js'
import { createChordParser, createChordRenderer, getChordInfoFromRenderedChord } from '@chords-extractor/common/chords.js'
import AudioAnalysis from './AudioAnalysis.js'
import { analyzeAudioWithPython } from './python.js'

export const analyzeAudioProcessor = async (job) => {
  const { youtubeId, title, duration } = job.data

  const { bpm, chordsPerBeats } = await analyzeAudioWithPython({ youtubeId })

  const chordsSymbols = chordsPerBeats.map(({ chord }) => chord)
  const chordsFormatted = getChordsFormatted({ chordsSymbols })
  const chordsFormattedPerBeats = chordsFormatted.map((chordFormatted, index) => (
    { ...chordsPerBeats[index], chord: chordFormatted })
  )

  await AudioAnalysis.create({
    youtubeId,
    title,
    bpm,
    chordsPerBeats: chordsFormattedPerBeats,
    duration
  })
}

const { chordParserFactory, chordRendererFactory } = chordSymbol

const getChordsFormatted = ({ chordsSymbols }) => {
  const parseChord = createChordParser(chordParserFactory)
  const renderChord = createChordRenderer(chordRendererFactory)

  const formattedChords = chordsSymbols.map((chordSymbol) => {
    if (chordSymbol === null) return null

    const parsedChord = parseChord(chordSymbol)

    if (parsedChord.error) return null

    const renderedChord = renderChord(parsedChord)
    const chordInfo = getChordInfoFromRenderedChord(renderedChord)

    return chordInfo
  })

  return formattedChords
}
