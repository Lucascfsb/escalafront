import type { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import type React from 'react'
import { useCallback, useRef } from 'react'
import { FiChevronDown, FiLock, FiLogIn, FiMail } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

import { useAuth } from '../../hooks/auth'
import { useToast } from '../../hooks/toast'
import getValidationErrors from '../../utils/getValidationErrors'

import logoImg from '../../assets/brasao.svg'

import Button from '../../components/Button'
import Input from '../../components/Input'
import Select from '../../components/Select'

import { AnimationContainer, Background, Container, Content } from './styles'

interface SignInFormData {
  email: string
  password: string
  role: string
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null)

  const { signIn } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um E-mai válido'),
          password: Yup.string().required('Senha obrigatória!'),
          role: Yup.string().required('Selecione seu nível de acesso'),
        })

        await schema.validate(data, {
          abortEarly: false,
        })

        await signIn({
          email: data.email,
          password: data.password,
          role: data.role,
        })

        navigate('/dashboard')
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)
          formRef.current?.setErrors(errors)

          return
        }

        addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description: 'Occoreu um erro ao fazer login, cheque suas credenciais.',
        })
      }
    },
    [signIn, addToast, navigate]
  )

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="Exército Brasilero" />

          <Form
            ref={formRef}
            onSubmit={handleSubmit}
            initialData={{ role: '' }}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
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

          <Link to="/signup">
            <FiLogIn />
            Criar conta
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  )
}

export default SignIn
