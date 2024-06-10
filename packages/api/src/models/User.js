import { usersCollection } from '@chords-extractor/common/mongo.js'
import { ObjectId } from 'mongodb'
class User {
  _id
  name
  lastName
  email
  password

  constructor ({ id, name, lastName, email, password }) {
    this._id = id
    this.name = name
    this.lastName = lastName
    this.email = email
    this.password = password
  }

  static async create ({ name, lastName, email, password }) {
    const newUser = { name, lastName, email, password }
    const { insertedId } = await usersCollection().insertOne(newUser)
    return { _id: insertedId, ...newUser }
  }

  static async findOneById ({ _id }) {
    try {
      const objectId = new ObjectId(_id)
      const user = await usersCollection().findOne({ _id: objectId })
      if (user === null) return null
      return user
    } catch (error) {
      if (error.name === 'BSONError') return null
      throw error
    }
  }

  static async findOneByEmail ({ email }) {
    const user = await usersCollection().findOne({ email })
    if (user === null) return null
    return user
  }
}

export default User
