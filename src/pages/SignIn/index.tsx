import type { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import type React from 'react'
import { useCallback, useContext, useRef } from 'react'
import { FiChevronDown, FiLock, FiLogIn, FiMail } from 'react-icons/fi'
import * as Yup from 'yup'

import { AuthContext } from '../../context/AuthContext'
import getValidationErrors from '../../utils/getValidationErrors'

import logoImg from '../../assets/brasao.svg'

import Button from '../../components/Button'
import Input from '../../components/Input'
import Select from '../../components/Select'

import { Background, Container, Content } from './styles'

interface SignInFormData {
  email: string
  password: string
  role: string
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null)

  const { signIn } = useContext(AuthContext)

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          email: Yup.string().required('E-mail obrigatório').email('Digite um E-mai válido'),
          password: Yup.string().required('Senha obrigatória!'),
          role: Yup.string().required('Selecione seu nível de acesso'),
        })

        await schema.validate(data, {
          abortEarly: false,
        })

        signIn({
          email: data.email,
          password: data.password,
          role: data.role,
        })
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)
          formRef.current?.setErrors(errors)
        }
      }
    },
    [signIn]
  )

  return (
    <Container>
      <Content>
        <img src={logoImg} alt="Exército Brasilero" />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Faça seu logon</h1>
          <Input name="email" icon={FiMail} placeholder="Email" />
          <Input name="password" icon={FiLock} type="password" placeholder="Senha" />
          <Select
            name="role"
            icon={FiChevronDown}
            options={[
              { value: 'admin', label: 'Administrador' },
              { value: 'usuário', label: 'Usuário' },
              { value: 'consulta', label: 'Consulta' },
            ]}
          />

          <Button type="submit">Entrar</Button>

          <a href="forgot">Esqueci minha senha</a>
        </Form>

        <a href="login">
          <FiLogIn />
          Criar conta
        </a>
      </Content>
      <Background />
    </Container>
  )
}

export default SignIn
