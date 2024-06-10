import { Router } from 'express'
import authRoutes from './auth.js'
import audioAnalysesRoutes from './audioAnalyses.js'

const router = Router()

router.use('/api/auth/local', authRoutes)
router.use('/api/audio-analyses', audioAnalysesRoutes)

export default router
