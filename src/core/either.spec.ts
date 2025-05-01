import { Either, left, right } from './either'

function doSomething(sholdSuccess: boolean): Either<string, number> {
  if (sholdSuccess) {
    return right(10)
  }

  return left('error')
}

test('success result', () => {
  const result = doSomething(true)

  expect(result.isRight()).toBe(true)
  expect(result.isLeft()).toBe(false)
})

test('error result', () => {
  const result = left('success')

  expect(result.isLeft()).toBe(true)
  expect(result.isRight()).toBe(false)
})
