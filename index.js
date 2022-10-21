const express = require('express')
const { urlencoded, json } = require('body-parser')
const makeRepositories = require('./middleware/repositories')
const {
  EntityNotFoundError
} = require('./repositories/errors/EntityNotFoundError')
const {
  SchemaValidationError
} = require('./repositories/errors/SchemaValidationError')

const STORAGE_FILE_PATH = 'questions.json'
const PORT = 3000

const app = express()

app.use(urlencoded({ extended: true }))
app.use(json())
app.use(makeRepositories(STORAGE_FILE_PATH))

app.get('/', (_, res) => {
  res.json({ message: 'Welcome to responder!' })
})

app.get('/questions', async (req, res) => {
  try {
    const questions = await req.repositories.questionRepo.getQuestions()
    return res.status(200).json(questions)
  } catch (error) {
    return res.status(500).json({ error: "couldn't handle the request" })
  }
})

app.get('/questions/:questionId', async (req, res) => {
  const { questionId } = req.params

  try {
    const question = await req.repositories.questionRepo.getQuestionById(
      questionId
    )
    return res.status(200).json(question)
  } catch (error) {
    if (error instanceof EntityNotFoundError) {
      return res.status(400).json({ error: error.message })
    } else {
      return res.status(500).json({ error: "couldn't handle the request" })
    }
  }
})

app.post('/questions', async (req, res) => {
  const questionBody = req.body

  try {
    const questionId = await req.repositories.questionRepo.addQuestion(
      questionBody
    )
    return res.status(200).json({ questionId })
  } catch (error) {
    if (error instanceof SchemaValidationError) {
      return res.status(400).json({ error: error.message })
    } else {
      return res.status(500).json({ error: "couldn't handle the request" })
    }
  }
})

app.get('/questions/:questionId/answers', async (req, res) => {
  const { questionId } = req.params
  try {
    const answers = await req.repositories.questionRepo.getAnswers(questionId)
    return res.status(200).json(answers)
  } catch (error) {
    if (error instanceof EntityNotFoundError) {
      return res.status(400).json({ error: error.message })
    } else {
      return res.status(500).json({ error: "couldn't handle the request" })
    }
  }
})

app.post('/questions/:questionId/answers', async (req, res) => {
  const { questionId } = req.params
  const answerBody = req.body

  try {
    const answerId = await req.repositories.questionRepo.addAnswer(
      questionId,
      answerBody
    )
    return res.status(200).json({ answerId })
  } catch (error) {
    if (
      error instanceof EntityNotFoundError ||
      error instanceof SchemaValidationError
    ) {
      return res.status(400).json({ error: error.message })
    } else {
      return res.status(500).json({ error: "couldn't handle the request" })
    }
  }
})

app.get('/questions/:questionId/answers/:answerId', async (req, res) => {
  const { questionId, answerId } = req.params

  try {
    const answer = await req.repositories.questionRepo.getAnswer(
      questionId,
      answerId
    )
    return res.status(200).json(answer)
  } catch (error) {
    if (error instanceof EntityNotFoundError) {
      return res.status(400).json({ error: error.message })
    } else {
      return res.status(500).json({ error: "couldn't handle the request" })
    }
  }
})

app.listen(PORT, () => {
  console.log(`Responder app listening on port ${PORT}`)
})
