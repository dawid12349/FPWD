class SchemaValidationError extends Error {
  constructor(entityName, message = '', ...args) {
    super(message, ...args)
    this.message = `validation for ${entityName} failed - ${message}`
  }
}
module.exports = {
  SchemaValidationError
}
