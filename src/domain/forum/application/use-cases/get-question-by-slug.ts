import { Either, left, right } from '@/core/either'
import type { Question } from '../../enterprise/entities/question'
import type { QuestionsRepository } from '../repositories/questions-repository'
import { ResouceNotFoundError } from '@/core/errors/erros/resource-not-found-error'

interface GetQuestionBySlugUseCaseRequets {
  slug: string
}

type GetQuestionBySlugUseCaseResponse = Either<
  ResouceNotFoundError,
  {
    question: Question
  }
>

export class GetQuestionBySlugUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    slug,
  }: GetQuestionBySlugUseCaseRequets): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionsRepository.findBySlug(slug)

    if (!question) {
      return left(new ResouceNotFoundError())
    }

    return right({
      question,
    })
  }
}
