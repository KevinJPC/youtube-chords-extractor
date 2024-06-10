import { tryCatch } from '../utils/tryCatch.js'
import AppError from '../utils/AppError.js'
import { SESSION_COOKIE_NAME, httpCodes } from '../constants/index.js'
import User from '../models/User.js'
import { hashPassword } from '../utils/password.js'

export const login = tryCatch(async (req, res) => {
  res.status(httpCodes.OK).end()
})

export const register = tryCatch(async (req, res) => {
  const { email, name, lastName, password } = req.body
  const hashedPassword = await hashPassword(password)
  const newUser = await User.create({ email, name, lastName, password: hashedPassword })
  res.status(httpCodes.OK).json({
    _id: newUser._id,
    name: newUser.name,
    lastName: newUser.lastName
  })
})

export const getStatus = tryCatch(async (req, res) => {
  res.status(httpCodes.OK).json({ user: req?.user })
})

export const verifyEmail = tryCatch(async (req, res) => {
  throw new AppError(null, 'Not implemented yet', httpCodes.NOT_IMPLEMENTED)
})

export const logout = tryCatch(async (req, res) => {
  req.session.destroy()
  res.clearCookie(SESSION_COOKIE_NAME)
  res.status(httpCodes.OK).end()
})
