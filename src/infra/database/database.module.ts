import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.services'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-question-repository'
import { PrismaAnswerRepository } from './prisma/repositories/prisma-answers-repository'
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comments-repository'
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments-repository'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository'
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'

@Module({
  providers: [
    PrismaService,
    PrismaAnswerRepository,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
    PrismaAnswerCommentsRepository,
    PrismaQuestionCommentsRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaQuestionAttachmentsRepository,
  ],
  exports: [
    PrismaService,
    QuestionsRepository,
    PrismaAnswerRepository,
    PrismaAnswerCommentsRepository,
    PrismaQuestionCommentsRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaQuestionAttachmentsRepository,
  ],
})
export class DatabaseModule {}
