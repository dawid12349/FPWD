class EntityNotFoundError extends Error {
  constructor(entityName, id, message = '', ...args) {
    super(message, ...args)
    this.message = `${entityName} with id-${id} was not found`
  }
}
