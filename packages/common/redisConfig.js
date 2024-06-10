import Joi from 'joi'

const configSchema = Joi.object({
  REDIS_PORT: Joi.number().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PASSWORD: Joi.string().required()
}).options({
  abortEarly: false,
  stripUnknown: true
})

const { error, value: validatedConfig } = configSchema.validate(process.env)

if (error) throw new Error(`Env variables validation error. ${error.message}`)

export default {
  port: validatedConfig.REDIS_PORT,
  host: validatedConfig.REDIS_HOST,
  password: validatedConfig.REDIS_PASSWORD,
  audioAnalysesQueueName: 'audio-analyses'
}
