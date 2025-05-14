import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidAttachmentType extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`file type ${identifier} is not valid.`)
  }
}
