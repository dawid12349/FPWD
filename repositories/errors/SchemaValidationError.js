class SchemaValidationError extends Error {
  constructor(entityName, message = '', ...args) {
    super(message, ...args)
    this.message = ` validation for ${entityName} failed - invalid object body`
  }
}
module.exports = {
  SchemaValidationError
}
