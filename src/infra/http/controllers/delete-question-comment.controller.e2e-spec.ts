import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionCommentFactory } from 'test/factories/make-question-comment'
import { StudentFactory } from 'test/factories/make-student'

describe('Delete Question Comment (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let questionCommentFactory: QuestionCommentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    questionCommentFactory = moduleRef.get(QuestionCommentFactory)
    await app.init()
  })

  test('[DELETE] /questions/comments/:id', async () => {
    const user = await studentFactory.makePrismaStudent()

    const session = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const questionComment =
      await questionCommentFactory.makePrismaQuestionComment({
        questionId: question.id,
        authorId: user.id,
      })

    const response = await request(app.getHttpServer())
      .delete(`/questions/comments/${questionComment.id.toString()}`)
      .set('Authorization', `Bearer ${session}`)

    expect(response.statusCode).toBe(204)

    const commentOnDatabase = await prisma.comment.findFirst({
      where: {
        id: questionComment.id.toString(),
      },
    })

    expect(commentOnDatabase).toBeNull()
  })
})
