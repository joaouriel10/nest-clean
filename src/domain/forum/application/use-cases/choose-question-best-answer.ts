import { Either, left, right } from '@/core/either'
import type { Question } from '../../enterprise/entities/question'
import type { AnswersRepository } from '../repositories/answers-repository'
import type { QuestionsRepository } from '../repositories/questions-repository'
import { ResouceNotFoundError } from '@/core/errors/erros/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/erros/not-allowed-error'

interface ChooseQuestionBestAnswerUseCaseRequets {
  answerId: string
  authorId: string
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<
  ResouceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private answerRepository: AnswersRepository,
    private questionsRepository: QuestionsRepository,
  ) {}

  async execute({
    answerId,
    authorId,
  }: ChooseQuestionBestAnswerUseCaseRequets): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      return left(new ResouceNotFoundError())
    }

    const question = await this.questionsRepository.findById(
      answer.questionId.toString(),
    )

    if (!question) {
      return left(new ResouceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError())
    }

    question.bestAnswerId = answer.id

    await this.questionsRepository.save(question)

    return right({
      question,
    })
  }
}
