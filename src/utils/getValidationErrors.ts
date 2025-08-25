import type { ValidationError } from 'yup'

interface Errors {
  [key: string]: string
}

export function getValidationErrors(err: ValidationError): Errors {
  const validationErrors: Errors = {}

  for (const error of err.inner) {
    if (error.path) {
      validationErrors[error.path] = error.message
    }
  }

  return validationErrors
}
