import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { FakeUploader } from 'test/storage/fake-uploader'
import { FakeUploader } from 'test/storage/fake-uploader'
import { InvalidAttachmentType } from './errors/invalid-attachment-type'
import { RegisterStudentUseCase } from './register-student'
import { UploadAndCreateAttachmentUsecase } from './upload-and-create-attachment'

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let fakeUploader: FakeUploader
let sut: UploadAndCreateAttachmentUsecase

describe('Upload and Create Attachment', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    fakeUploader = new FakeUploader()

    sut = new UploadAndCreateAttachmentUsecase(
      inMemoryAttachmentsRepository,
      fakeUploader,
    )
  })

  it('should be able to upload and create an attachment', async () => {
    const result = await sut.execute({
      fileName: 'test.png',
      fileType: 'image/png',
      body: Buffer.from('test'),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepository.items[0],
    })
    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'test.png',
      }),
    )
  })

  it('should not be able to upload an attachment with an invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'test.mp3',
      fileType: 'text/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentType)
  })
})
