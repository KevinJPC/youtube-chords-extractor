import Joi from 'joi'

const configSchema = Joi.object({
  MONGO_URI: Joi.string().required(),
  MONGO_DB_NAME: Joi.string().required()
}).options({
  abortEarly: false,
  stripUnknown: true
})

const { error, value: validatedConfig } = configSchema.validate(process.env)
if (error) throw new Error(`Env variables validation error. ${error.message}`)

export default {
  uri: validatedConfig.MONGO_URI,
  dbName: validatedConfig.MONGO_DB_NAME
}
