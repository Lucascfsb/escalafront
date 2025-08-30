import * as Yup from 'yup'

export const SignInPageSchema = Yup.object().shape({
  email: Yup.string()
    .required('E-mail é obrigatório')
    .email('Inclua um "@" no endereço de email. user@provedor.com'),
  password: Yup.string().required('Senha é obrigatória'),
})
