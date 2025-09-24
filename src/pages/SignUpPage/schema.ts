import * as Yup from 'yup'

export const SignUpPageSchema = Yup.object().shape({
  username: Yup.string()
    .required('Nome de Usuário é obrigatório')
    .min(3, 'O nome de usuário deve ter no mínimo 3 caracteres')
    .max(50, 'O nome de usuário deve ter no máximo 50 caracteres')
    .matches(
      /^[a-zA-Z\s]+$/,
      'O nome de usuário não pode conter números ou caracteres especiais'
    ),

  email: Yup.string()
    .required('E-mail é obrigatório')
    .email('Inclua um "@" no endereço de email. user@provedor.com'),

  password: Yup.string()
    .required('Senha é obrigatória')
    .min(6, 'A senha deve ter no mínimo 6 caracteres'),

  password_confirmation: Yup.string()
    .required('Confirmação de senha é obrigatória')
    .oneOf([Yup.ref('password')], 'As senhas não coincidem'),
  role: Yup.object()
    .shape({
      value: Yup.string().required('Selecione seu nível de acesso'),
      label: Yup.string().required(),
    })
    .required('Selecione seu nível de acesso'),
})
