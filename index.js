const express = require('express')
const { urlencoded, json } = require('body-parser')
const makeRepositories = require('./middleware/repositories')

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
  const questions = await req.repositories.questionRepo.getQuestions()
  res.json(questions)
})

app.get('/questions/:questionId', async (req, res) => {
  const { questionId } = req.params

  const question = await req.repositories.questionRepo.getQuestionById(
    questionId
  )

  if (!question) {
    return res.status(400).json({
      success: false,
      message: `couldn't find question with id - ${questionId}`
    })
  }

  return res.status(200).json(question)
})

app.post('/questions', async (req, res) => {
  const questionBody = req.body
  const question = await req.repositories.questionRepo.addQuestion(questionBody)

  if (!question) {
    return res.status(400).json({
      success: false,
      message: `couldn't add question`
    })
  }

  return res.status(200).json(question)
})

app.get('/questions/:questionId/answers', async (req, res) => {
  const { questionId } = req.params
  const question = await req.repositories.questionRepo.getAnswers(questionId)

  if (!question) {
    return res.status(400).json({
      success: false,
      message: `couldn't find answers for question with id - ${questionId}`
    })
  }

  return res.status(200).json(question)
})

app.post('/questions/:questionId/answers', async (req, res) => {
  const { questionId } = req.params
  const answerBody = req.body

  const answer = await req.repositories.questionRepo.addAnswer(
    questionId,
    answerBody
  )

  if (!answer) {
    return res.status(400).json({
      success: false,
      message: `couldn't add answer for question with id - ${questionId}`
    })
  }

  return res.status(200).json(answer)
})

app.get('/questions/:questionId/answers/:answerId', (req, res) => {})

app.listen(PORT, () => {
  console.log(`Responder app listening on port ${PORT}`)
})
