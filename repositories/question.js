const { EntityNotFoundError } = require('./errors/EntityNotFoundError')
const { readFile, writeFile } = require('fs/promises')
const { questionSchema, answerSchema } = require('./utils/validation')
const { SchemaValidationError } = require('./errors/SchemaValidationError')

const makeQuestionRepository = fileName => {
  let questions = []

  const getQuestions = async () => {
    await loadQuestionsFromFile()
    return questions
  }

  const getQuestionById = async questionId => {
    await loadQuestionsFromFile()
    const question = questions.find(question => question.id === questionId)

    if (!question) {
      throw new EntityNotFoundError('question', questionId)
    }

    return question
  }

  const addQuestion = async question => {
    const { error } = questionSchema.validate(question)
    if (error) {
      throw new SchemaValidationError('question')
    }

    await loadQuestionsFromFile()

    questions.push(question)

    await writeQuestionsToFile()

    return question.id
  }

  const getAnswers = async questionId => {
    const foundQuestion = await getQuestionById(questionId)
    return foundQuestion.answers || []
  }

  const getAnswer = async (questionId, answerId) => {
    const answers = await getAnswers(questionId)

    const foundAnswer =
      Array.isArray(answers) && answers.find(answer => answer.id === answerId)

    if (!foundAnswer) {
      throw new EntityNotFoundError('answer', answerId)
    }

    return foundAnswer
  }

  const addAnswer = async (questionId, answer) => {
    const { error } = answerSchema.validate(answer)
    if (error) {
      throw new SchemaValidationError('answer')
    }

    let question = await getQuestionById(questionId)

    if (Array.isArray(question.answers)) {
      question.answers.push(answer)
    } else {
      question.answers = [answer]
    }

    await writeQuestionsToFile()

    return answer.id
  }

  const loadQuestionsFromFile = async () => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    questions = JSON.parse(fileContent) || []
  }

  const writeQuestionsToFile = async () => {
    await writeFile(fileName, JSON.stringify([...questions], null, 2), {
      encoding: 'utf-8'
    })
  }

  return {
    getQuestions,
    getQuestionById,
    addQuestion,
    getAnswers,
    getAnswer,
    addAnswer
  }
}

module.exports = { makeQuestionRepository }
