import { Either, left, right } from '@/core/either'
import type { QuestionsRepository } from '../repositories/questions-repository'
import { NotAllowedError } from '@/core/errors/erros/not-allowed-error'
import { ResouceNotFoundError } from '@/core/errors/erros/resource-not-found-error'

interface DeleteQuestionUseCaseRequets {
  authorId: string
  questionId: string
}

type DeleteQuestionUseCaseResponse = Either<
  ResouceNotFoundError | NotAllowedError,
  null
>

export class DeleteQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    questionId,
  }: DeleteQuestionUseCaseRequets): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return left(new ResouceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError())
    }

    await this.questionsRepository.delete(question)

    return right(null)
  }
}
