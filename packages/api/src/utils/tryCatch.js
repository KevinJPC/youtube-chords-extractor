export const tryCatch = (controllerFn) => {
  return async (req, res, next) => {
    try {
      return await controllerFn(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
