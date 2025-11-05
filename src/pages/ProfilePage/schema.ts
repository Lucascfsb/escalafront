import * as Yup from 'yup'
import type { FormInput } from './types'

export const ProfilePageSchema: Yup.ObjectSchema<FormInput> = Yup.object().shape({
  username: Yup.string().required('Nome de Usuário obrigatório'),
  email: Yup.string().required('E-mail obrigatório').email('Digite um E-mail válido'),
  role: Yup.object()
    .shape({
      value: Yup.string().required('Selecione seu nível de acesso'),
      label: Yup.string().required(),
    })
    .nullable()
    .required('Selecione seu nível de acesso'),
  oldPassword: Yup.string().optional(),
  password: Yup.string().when('oldPassword', {
    is: (oldPassword: string) => !!oldPassword,
    // biome-ignore lint/suspicious/noThenProperty: <explanation>
    then: field =>
      field
        .required('Nova senha obrigatória se a senha atual for informada')
        .min(6, 'A nova senha deve ter no mínimo 6 dígitos'),
    otherwise: field => field.optional(),
  }),
  passwordConfirmation: Yup.string().when('password', {
    is: (password: string) => !!password,
    // biome-ignore lint/suspicious/noThenProperty: <explanation>
    then: field =>
      field
        .required('Confirmação de senha obrigatória')
        .oneOf([Yup.ref('password')], 'Confirmação de senha incorreta'),
    otherwise: field => field.optional(),
  }),
})
