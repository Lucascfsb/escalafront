export interface SignUpFormData {
  username: string
  email: string
  password: string
  password_confirmation: string
  role: string
}

export interface FormInput {
  username: string
  email: string
  password: string
  password_confirmation: string
  role: {
    value: string
    label: string
  }
}
