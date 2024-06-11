import Joi from 'joi'

const configSchema = Joi.object({
  FRONTEND_URL: Joi.string().required()
}).options({
  abortEarly: false,
  stripUnknown: true
})

const { error, value: validatedConfig } = configSchema.validate(process.env)
if (error) throw new Error(`Env variables validation error. ${error.message}`)

export default {
  frontendUrl: validatedConfig.FRONTEND_URL
}
