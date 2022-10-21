const { writeFile, rm } = require('fs/promises')
const { faker } = require('@faker-js/faker')
const { makeQuestionRepository } = require('./question')
const {
  SimpleQuestionStub,
  SimpleAnswerStub,
  QuestionWithAnswersStub
} = require('./utils/stub')
const { EntityNotFoundError } = require('./errors/EntityNotFoundError')
const { SchemaValidationError } = require('./errors/SchemaValidationError')

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

  test('should return 1 question with specified correct id', async () => {
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

  test(`should add 1 question`, async () => {
    const testQuestion1 = SimpleQuestionStub()

    expect(await questionRepo.getQuestions()).toHaveLength(0)

    await questionRepo.addQuestion(testQuestion1)

    const result = await questionRepo.getQuestions()
    expect(result).toHaveLength(1)
    expect(result).toEqual(expect.arrayContaining(testQuestion1.answers))
  })

  test(`should throw an error when trying to add invalid question`, async () => {
    const testQuestion1 = SimpleQuestionStub()

    expect(await questionRepo.getQuestions()).toHaveLength(0)

    delete testQuestion1.author

    const apply = async () => await questionRepo.addQuestion(testQuestion1)

    await expect(apply()).rejects.toThrow(SchemaValidationError)
    expect(await questionRepo.getQuestions()).toHaveLength(0)
  })

  test(`should return 3 answers for question with specified correct questionId`, async () => {
    const testQuestion1 = QuestionWithAnswersStub()
    const testQuestion2 = QuestionWithAnswersStub()
    const testQuestions = [testQuestion1, testQuestion2]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    const result = await questionRepo.getAnswers(testQuestion1.id)
    expect(result).toHaveLength(testQuestion1.answers.length)
    expect(result).toEqual(expect.arrayContaining(testQuestion1.answers))
    expect(result).not.toEqual(expect.arrayContaining(testQuestion2.answers))
  })

  test(`should throw an error for answers when no question was found with specified invalid questionId`, async () => {
    const testQuestion1 = QuestionWithAnswersStub()
    const testQuestions = [testQuestion1]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    const apply = async () =>
      await questionRepo.getAnswers(faker.datatype.uuid())

    await expect(apply()).rejects.toThrow(EntityNotFoundError)
  })

  test(`should add 1 answer for question when parameters are valid`, async () => {
    const testQuestion1 = QuestionWithAnswersStub()
    const testQuestion2 = SimpleQuestionStub()
    const answer1 = SimpleAnswerStub()
    const answer2 = SimpleAnswerStub()

    delete testQuestion2.answers

    const testQuestions = [testQuestion1, testQuestion2]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    expect(await questionRepo.getAnswers(testQuestion1.id)).toHaveLength(3)
    expect(await questionRepo.getAnswers(testQuestion2.id)).toHaveLength(0)

    const resultId1 = await questionRepo.addAnswer(testQuestion1.id, answer1)
    const resultId2 = await questionRepo.addAnswer(testQuestion2.id, answer2)
    const resultForTestQuestion1 = await questionRepo.getAnswers(
      testQuestion1.id
    )
    const resultForTestQuestion2 = await questionRepo.getAnswers(
      testQuestion2.id
    )

    expect(resultId1).toMatch(answer1.id)
    expect(resultForTestQuestion1).toHaveLength(4)
    expect(resultForTestQuestion1).toEqual(expect.arrayContaining([answer1]))

    expect(resultId2).toMatch(answer2.id)
    expect(resultForTestQuestion2).toHaveLength(1)
    expect(resultForTestQuestion2).toEqual(expect.arrayContaining([answer2]))
  })

  test(`should throw an error when trying to add answer with invalid parameters`, async () => {
    const testQuestion1 = SimpleQuestionStub()
    const answer1 = SimpleAnswerStub()
    const answer2 = SimpleAnswerStub()

    delete answer1.author

    const testQuestions = [testQuestion1]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    expect(await questionRepo.getAnswers(testQuestion1.id)).toHaveLength(0)

    const applyWithWrongRequestBody = async () =>
      await questionRepo.addAnswer(testQuestion1.id, answer1)

    const applyWithWrongId = async () =>
      await questionRepo.addAnswer(faker.datatype.uuid(), answer2)

    await expect(applyWithWrongId()).rejects.toThrow(EntityNotFoundError)
    await expect(applyWithWrongRequestBody()).rejects.toThrow(
      SchemaValidationError
    )
    expect(await questionRepo.getAnswers(testQuestion1.id)).toHaveLength(0)
  })

  test(`should return 1 answer with specified correct questionId and answerId`, async () => {
    const testAnswer1 = SimpleAnswerStub()
    const testQuestion1 = QuestionWithAnswersStub([testAnswer1])
    const testQuestion2 = QuestionWithAnswersStub()
    const testQuestions = [testQuestion1, testQuestion2]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    const result = await questionRepo.getAnswer(
      testQuestion1.id,
      testAnswer1.id
    )

    expect(result).toMatchObject(testAnswer1)
  })

  test(`should throw error when invalid questionId and answerId is specified`, async () => {
    const testAnswer1 = SimpleAnswerStub()
    const testQuestion1 = QuestionWithAnswersStub([testAnswer1])
    const testQuestions = [testQuestion1]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    const applyInvalidAnswerId = async () =>
      await questionRepo.getAnswer(testQuestion1.id, faker.datatype.uuid())

    const applyInvalidQuestionId = async () =>
      await questionRepo.getAnswer(faker.datatype.uuid(), testAnswer1.id)

    await expect(applyInvalidQuestionId()).rejects.toThrow(EntityNotFoundError)
    await expect(applyInvalidAnswerId()).rejects.toThrow(EntityNotFoundError)
  })
})
