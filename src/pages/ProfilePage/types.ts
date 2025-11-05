export interface ProfileUpdateData {
  username: string
  email: string
  role: string
  oldPassword: string
  password?: string
  passwordConfirmation?: string
}

export type FormInput = {
  username: string
  email: string
  role: {
    value: string
    label: string
  }
  oldPassword?: string
  password?: string
  passwordConfirmation?: string
}
