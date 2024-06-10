import LocalStrategy from 'passport-local'
import passport from 'passport'
import User from '../models/User.js'
import AppError from '../utils/AppError.js'
import { comparePassword } from '../utils/password.js'
import { httpCodes } from '../constants/index.js'

// Local Strategy
const verifyFn = async (email, password, cb) => {
  try {
    console.log('verifier')
    const user = await User.findOneByEmail({ email })
    if (user === null) throw new AppError(404, 'Invalid credentials', httpCodes.NOT_FOUND)
    const isValidPassword = await comparePassword(password, user.password)
    if (!isValidPassword) throw new AppError(404, 'Invalid credentials', httpCodes.NOT_FOUND)
    return cb(null, user)
  } catch (error) {
    cb(error)
  }
}

const localStrategy = new LocalStrategy({ usernameField: 'email' }, verifyFn)

passport.use(localStrategy)

passport.serializeUser((user, cb) => {
  console.log('serializer')
  cb(null, { _id: user._id })
})

passport.deserializeUser(async ({ _id }, cb) => {
  try {
    console.log('deserializer')
    return cb(null, { _id })
  } catch (error) {
    cb(error)
  }
})

export const initPassport = () => {
  return passport.initialize()
}

export const initPassportSession = () => {
  return passport.session()
}
