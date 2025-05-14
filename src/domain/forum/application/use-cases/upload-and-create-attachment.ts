import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { Attachment } from '../../enterprise/entities/attachment'
import { Uploader } from '../../storage/uploader'
import { AttachmentsRepository } from '../repositories/attachments-repository'
import { InvalidAttachmentType } from './errors/invalid-attachment-type'

interface UploadAndCreateAttachmentUsecaseRequest {
  fileName: string
  fileType: string
  body: Buffer
}

type UploadAndCreateAttachmentUsecaseResponse = Either<
  InvalidAttachmentType,
  {
    attachment: Attachment
  }
>

@Injectable()
export class UploadAndCreateAttachmentUsecase {
  constructor(
    private attachmentRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAndCreateAttachmentUsecaseRequest): Promise<UploadAndCreateAttachmentUsecaseResponse> {
    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
      return left(new InvalidAttachmentType(fileType))
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    })

    const attachment = Attachment.create({
      title: fileName,
      url,
    })

    await this.attachmentRepository.create(attachment)

    return right({
      attachment,
    })
  }
}
