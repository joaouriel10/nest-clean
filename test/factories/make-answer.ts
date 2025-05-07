import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Answer,
  AnswerProps,
} from '@/domain/forum/enterprise/entities/answer'
import { PrismaAnswerMapper } from '@/infra/database/mappers/prisma-answer-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeAnswer(
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityID,
) {
  const newAnswer = Answer.create(
    {
      authorId: new UniqueEntityID(),
      questionId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )

  return newAnswer
}

@Injectable()
export class AnswerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswer(data: Partial<AnswerProps> = {}): Promise<Answer> {
    const answer = makeAnswer(data)

    await this.prisma.answer.create({
      data: PrismaAnswerMapper.toPrisma(answer),
    })

    return answer
  }
}
