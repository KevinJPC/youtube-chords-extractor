import cors from 'cors'
import config from '../config/index.js'

export const initCors = () => cors({
  origin: [config.frontendUrl]
})
