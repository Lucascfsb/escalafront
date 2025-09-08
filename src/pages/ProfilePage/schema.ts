import * as Yup from 'yup'

export const ProfilePageSchema = Yup.object().shape({
  username: Yup.string().required('Nome de Usuário obrigatório'),
  email: Yup.string().required('E-mail obrigatório').email('Digite um E-mail válido'),
  role: Yup.string().required('Selecione seu nível de acesso'),
  oldPassword: Yup.string().optional().default(''),
  password: Yup.string()
    .when('oldPassword', (oldPassword, field) =>
      oldPassword[0]
        ? field
            .required('Nova senha obrigatória se a senha atual for informada')
            .min(6, 'A nova senha deve ter no mínimo 6 dígitos')
        : field
    )
    .default(''),
  passwordConfirmation: Yup.string()
    .when('password', (password, field) =>
      password[0]
        ? field
            .required('Confirmação de senha obrigatória')
            .oneOf([Yup.ref('password')], 'Confirmação de senha incorreta')
        : field
    )
    .default(''),
})
