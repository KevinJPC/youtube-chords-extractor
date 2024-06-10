export const getChordInfoFromRenderedChord = (renderedChord) => {
  const {
    input: {
      rootNote: rawRootNote,
      descriptor: rawDescriptor,
      bassNote: rawBassNote,
      symbol
    }
  } = renderedChord

  const rootNote = rawRootNote.at(0)
  const signature = rawRootNote.at(1)
  const isMinor = rawDescriptor?.startsWith('m')
  const type = isMinor ? 'm' : ''
  const descriptor = isMinor ? rawDescriptor.substring(1) : rawDescriptor
  const bassNote = rawBassNote

  return { rootNote, signature, type, descriptor, symbol, bassNote }
}

export const createChordParser = (chordParserFactory, { notationSystems = ['english'] } = {}) =>
  chordParserFactory({ notationSystems })

export const createChordRenderer = (chordRendererFactory, {
  accidental = 'original',
  notationSystem = 'english',
  simplify = false,
  transposeValue = 0
} = {}) =>
  chordRendererFactory({
    accidental,
    notationSystem,
    simplify: simplify ? 'max' : 'none',
    transposeValue,
    useShortNamings: true,
    printer: 'raw'
  })

export const notes = {
  AFlat: 'Ab',
  A: 'A',
  ASharp: 'A#',
  BFlat: 'Bb',
  B: 'B',
  C: 'C',
  CSharp: 'C#',
  DFlat: 'Db',
  D: 'D',
  DSharp: 'D#',
  EFlat: 'Eb',
  E: 'E',
  F: 'F',
  FSharp: 'F#',
  GFlat: 'Gb',
  G: 'G',
  GSharp: 'G#'
}
