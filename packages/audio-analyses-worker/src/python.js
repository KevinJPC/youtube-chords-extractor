import path from 'node:path'
import os from 'node:os'
import url from 'node:url'
import fs from 'node:fs'
import { spawn } from 'node:child_process'
import readLine from 'node:readline'
import Joi from 'joi'

const VENV_INTERPRETER_PATH_BY_PLATFORM = {
  win32: 'Scripts/python.exe',
  darwin: 'bin/python',
  linux: 'bin/python'
}

let _pythonVenvInterpreter
export const loadPythonVenvInterpreter = () => {
  return new Promise((resolve, reject) => {
    const configSchema = Joi.object({
      PYTHON_VENV_PATH: Joi.string().required()
    }).options({
      abortEarly: false,
      stripUnknown: true
    })

    const { error, value: validatedConfig } = configSchema.validate(process.env)
    if (error) return reject(new Error(`Env variables validation error. ${error.message}`))

    const platform = os.platform()
    const venvInterpreterFinalPath = VENV_INTERPRETER_PATH_BY_PLATFORM[platform] || null

    if (!venvInterpreterFinalPath) return reject(new Error(`Could not determinate scripts folder name for platform ${platform}`))

    const pythonVenvInterpreter = path.join(validatedConfig.PYTHON_VENV_PATH, venvInterpreterFinalPath)
    if (!fs.existsSync(pythonVenvInterpreter)) return reject(new Error(`Python interpreter was not found at ${pythonVenvInterpreter}`))

    _pythonVenvInterpreter = pythonVenvInterpreter
    resolve(_pythonVenvInterpreter)
  })
}

const getPythonVenvInterpreter = () => {
  if (!_pythonVenvInterpreter) throw new Error('Error getting virtual env interpreter')
  return _pythonVenvInterpreter
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
  const pythonProcess = spawn(getPythonVenvInterpreter(), [PYTHON_SCRIPT, youtubeId])

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
        if (response.status === RESPONSE_STATUS.ERROR) {
          return reject(new Error(response?.errorMessage || 'An error had happend'))
        }
      } catch (error) {
        reject(error)
      }
    })

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString()
    })

    pythonProcess.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(error || 'Error analyzing audio'))
      }
    })
  })
}
