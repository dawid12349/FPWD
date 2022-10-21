const { faker } = require('@faker-js/faker')

const SimpleQuestionStub = (
  id = faker.datatype.uuid(),
  summary = faker.random.words(3),
  author = faker.name.findName(),
  answers = []
) => ({
  id: id,
  summary: summary,
  author: author,
  answers: answers
})

const SimpleAnswerStub = (
  id = faker.datatype.uuid(),
  summary = faker.random.words(3),
  author = faker.name.findName()
) => ({
  id: id,
  summary: summary,
  author: author
})

const QuestionWithAnswersStub = (
  answers = [SimpleAnswerStub(), SimpleAnswerStub(), SimpleAnswerStub()],
  id = faker.datatype.uuid(),
  summary = faker.random.words(3),
  author = faker.name.findName()
) => ({
  id: id,
  summary: summary,
  author: author,
  answers: answers
})

module.exports = {
  SimpleQuestionStub,
  SimpleAnswerStub,
  QuestionWithAnswersStub
}
