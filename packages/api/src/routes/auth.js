import { Router } from 'express'
import { getStatus, login, logout, register, verifyEmail } from '../controllers/authController.js'
import passport from 'passport'
import AppError from '../utils/AppError.js'
import { httpCodes } from '../constants/index.js'
import { tryCatch } from '../utils/tryCatch.js'
import { initPassportSession } from '../middlewares/passport.js'

const router = Router()

const isAuthenticated = tryCatch((req, res, next) => {
  if (req.isAuthenticated()) return next()
  throw new AppError('000', 'Forbiden', httpCodes.BAD_REQUEST)
})

router.post('/login', passport.authenticate('local'), login)
router.use(initPassportSession)
router.post('/logout', isAuthenticated, logout)
router.post('/register', register)
router.get('/status', getStatus)
router.post('/verify', verifyEmail)

export default router
