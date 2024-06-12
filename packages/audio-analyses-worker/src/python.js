import path from 'node:path'
import url from 'node:url'
import { exec, spawn } from 'node:child_process'
import readLine from 'node:readline'

let _venvPath
export const loadPythonVenvPath = () => {
  return new Promise((resolve, reject) => {
    exec('cd ../audio-analysis-py && python -m pipenv --venv', (error, stdout, stderr) => {
      if (error || stderr) {
        return reject(error || stderr)
      }

      const venvPath = stdout.trim()
      console.log('Python virtualenv path loaded')
      _venvPath = venvPath
      resolve(venvPath)
    })
  })
}

const getPythonVenvPath = () => {
  if (!_venvPath) throw new Error('Error getting virtual env path')
  return _venvPath
}

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const PYTHON_SCRIPT = path.join(__dirname, '..', '..', 'audio-analysis-py', 'src', 'main.py')

const RESPONSE_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error'
}

export const analyzeAudioWithPython = async ({
  youtubeId
}) => {
  const PYTHON = path.join(getPythonVenvPath(), 'scripts', 'python')
  const pythonProcess = spawn(PYTHON, [PYTHON_SCRIPT, youtubeId])

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
