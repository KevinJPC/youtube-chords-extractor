import morgan from 'morgan'

morgan.token('body', (req) => JSON.stringify(req.body))
export const initMorgan = () => morgan(':method :url :body')
