const Joi = require('joi')

const answerSchema = Joi.object({
  id: Joi.string().guid().required(),
  author: Joi.string().required(),
  summary: Joi.string().required()
})

const questionSchema = Joi.object({
  id: Joi.string().guid().required(),
  author: Joi.string().required(),
  summary: Joi.string().required(),
  answers: Joi.array().items(answerSchema)
})

module.exports = {
  answerSchema,
  questionSchema
}
