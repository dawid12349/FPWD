const { writeFile, rm } = require('fs/promises')
const { faker } = require('@faker-js/faker')
const { makeQuestionRepository } = require('./question')
const { SimpleQuestionStub } = require('./utils/stub')
const { EntityNotFoundError } = require('./errors/EntityNotFoundError')

describe('question repository', () => {
  const TEST_QUESTIONS_FILE_PATH = 'test-questions.json'
  let questionRepo

  beforeEach(async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))

    questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)
  })

  afterEach(async () => {
    await rm(TEST_QUESTIONS_FILE_PATH)
  })

  test('should return a list of 0 questions', async () => {
    expect(await questionRepo.getQuestions()).toHaveLength(0)
  })

  test('should return a list of 2 questions', async () => {
    const testQuestions = [SimpleQuestionStub(), SimpleQuestionStub()]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    expect(await questionRepo.getQuestions()).toHaveLength(2)
  })

  test('should return 1 question with specified id', async () => {
    const testQuestion1 = SimpleQuestionStub()
    const testQuestion2 = SimpleQuestionStub()
    const testQuestions = [testQuestion1, testQuestion2]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    const result = await questionRepo.getQuestionById(testQuestion1.id)
    expect(result).toMatchObject(testQuestion1)
  })

  test(`should throw error when no question was found with specified invalid questionId`, async () => {
    const testQuestion1 = SimpleQuestionStub()
    const testQuestions = [testQuestion1]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    const apply = async () =>
      await questionRepo.getQuestionById(faker.datatype.uuid())

    await expect(apply()).rejects.toThrow(EntityNotFoundError)
  })
})
