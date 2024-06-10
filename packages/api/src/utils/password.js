import crypto from 'node:crypto'

const KEY_LENGTH = 64

export const hashPassword = (password, salt = undefined) => {
  return new Promise((resolve, reject) => {
    if (!salt) salt = crypto.randomBytes(16).toString('hex')
    crypto.scrypt(password, salt, KEY_LENGTH, (error, derivedKey) => {
      if (error) return reject(error)
      const hashedPassword = `${salt}:${derivedKey.toString('hex')}`
      resolve(hashedPassword)
    })
  })
}

const splitHashedPassword = (hash) => {
  const [salt, key] = hash.split(':')
  return { salt, key }
}

export const comparePassword = async (password, hashedPassword) => {
  const { salt, key } = splitHashedPassword(hashedPassword)
  const hashedPasswordToCampare = await hashPassword(password, salt)
  const keyToCompare = splitHashedPassword(hashedPasswordToCampare).key
  const keyBuffer = Buffer.from(key)
  const keyBufferToCompare = Buffer.from(keyToCompare)
  const isValidPassword = crypto.timingSafeEqual(keyBuffer, keyBufferToCompare)
  return isValidPassword
}
