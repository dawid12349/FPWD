const { readFile, writeFile } = require('fs/promises')

const makeQuestionRepository = fileName => {
  const getQuestions = async () => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)

    return questions
  }

  const getQuestionById = async questionId => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent) || []
    return questions.find(question => question.id === questionId)
  }
  const addQuestion = async question => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent) || []
    questions.push(question)
    await writeFile(fileName, JSON.stringify(questions, null, 2), {
      encoding: 'utf-8'
    })
  }
  const getAnswers = async questionId => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent) || []
    const foundQuestion = questions.find(question => question.id === questionId)

    if (!foundQuestion && !foundQuestion.answers) {
      return undefined
    }

    return foundQuestion.answers
  }

  const getAnswer = async (questionId, answerId) => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent) || []
    const foundQuestion = questions.find(question => question.id === questionId)

    if (!foundQuestion && !foundQuestion.answers) {
      return undefined
    }

    return foundQuestion.answers.find(answer => answer.id === answerId)
  }
  const addAnswer = async (questionId, answer) => {}

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
