import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Student } from '@/domain/forum/enterprise/entities/student'
import { Prisma, User as PrismaUser } from '@prisma/client'

export class PrismaStudentMapper {
  static toDomain(raw: PrismaUser): Student {
    return Student.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(question: Student): Prisma.UserUncheckedCreateInput {
    return {
      id: question.id.toString(),
      name: question.name,
      email: question.email,
      password: question.password,
    }
  }
}
