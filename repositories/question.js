const { readFile, writeFile } = require('fs/promises')

const makeQuestionRepository = fileName => {
  const getQuestions = async () => await readQuestionsFromFile()

  const getQuestionById = async questionId => {
    const questions = await readQuestionsFromFile()
    return questions.find(question => question.id === questionId)
  }
  const addQuestion = async question => {
    const questions = await readQuestionsFromFile()
    questions.push(question)
    await writeFile(fileName, JSON.stringify(questions, null, 2), {
      encoding: 'utf-8'
    })
    return question
  }
  const getAnswers = async questionId => {
    const questions = await readQuestionsFromFile()
    const foundQuestion = questions.find(question => question.id === questionId)

    if (!foundQuestion || !Array.isArray(foundQuestion.answers)) {
      return undefined
    }

    return foundQuestion.answers
  }

  const getAnswer = async (questionId, answerId) => {
    const questions = await readQuestionsFromFile()
    const foundQuestion = questions.find(question => question.id === questionId)

    if (!Array.isArray(foundQuestion.answers)) {
      return undefined
    }

    return foundQuestion.answers.find(answer => answer.id === answerId)
  }

  const addAnswer = async (questionId, answer) => {
    const questions = await readQuestionsFromFile()
    const foundQuestion = questions.find(question => question.id === questionId)

    if (!foundQuestion) {
      return undefined
    }

    if (Array.isArray(foundQuestion.answers)) {
      foundQuestion.answers.push(answer)
    } else {
      foundQuestion.answers = [...answer]
    }

    await writeQuestionsToFile(questions)

    return answer
  }

  const readQuestionsFromFile = async () => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    return JSON.parse(fileContent) || []
  }

  const writeQuestionsToFile = async questions => {
    await writeFile(fileName, JSON.stringify(questions, null, 2), {
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
