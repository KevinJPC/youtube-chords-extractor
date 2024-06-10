import path from 'node:path'
import url from 'node:url'
import { spawn } from 'node:child_process'
import readLine from 'node:readline'
import chordSymbol from 'chord-symbol/lib/chord-symbol.js'
import { createChordParser, createChordRenderer, getChordInfoFromRenderedChord } from '@chords-extractor/common/chords.js'
import AudioAnalysis from './AudioAnalysis.js'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
console.log(__dirname)
const PYTHON_PROJECT_DIR = path.join(__dirname, '..', '..', 'audio-analysis-py')
const PYTHON_CMD = `cd ${PYTHON_PROJECT_DIR} && python -m pipenv run start`

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

const RESPONSE_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error'
}

export const analyzeAudioWithPython = async ({
  youtubeId
}) => {
  const pythonProcess = spawn(PYTHON_CMD, [youtubeId], { shell: true })

  const stdoutLineReader = readLine.createInterface({ input: pythonProcess.stdout })

  return new Promise((resolve, reject) => {
    let error = ''

    stdoutLineReader.on('line', (line) => {
      try {
        const response = JSON.parse(line)

        if (response.status === RESPONSE_STATUS.SUCCESS) {
          const { bpm, chords_per_beats: chordsPerBeats } = response.data
          const chordsPerBeatsMapped = chordsPerBeats.map(({ timestamp, chord }) => ({ timestamp, chord }))
          return resolve({ bpm, chordsPerBeats: chordsPerBeatsMapped })
        }
        return reject(response?.message || 'Error analyzing audio')
      } catch (error) {
        reject(error)
      }
    })

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString()
    })

    pythonProcess.on('exit', (code) => {
      if (code !== 0) {
        console.log('error', code)
        console.error('error analyzing audio error: ', error)
        reject(new Error('Error analyzing audio'))
      }
    })
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
