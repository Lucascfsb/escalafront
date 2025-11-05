import * as Yup from 'yup'

export const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required('Senha obrigatória!')
    .min(6, 'Senha deve ter no mínimo 6 caracteres'),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Confirmação incorreta')
    .required('Confirmação de senha obrigatória!'),
})
