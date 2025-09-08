import { yupResolver } from '@hookform/resolvers/yup'
import type React from 'react'
import { useCallback, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FiLock, FiLogIn, FiMail } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

import { useAuth } from '../../hooks/auth'
import { useToast } from '../../hooks/toast'

import logoImg from '../../assets/brasao.svg'

import { Button } from '../../components/Button'
import { Input } from '../../components/Input'

import { AnimationContainer, Background, Container, Content } from './styles'

interface SignInFormData {
  email: string
  password: string
}

const schema = Yup.object().shape({
  email: Yup.string().required('E-mail obrigatório').email('Digite um E-mail válido'),
  password: Yup.string().required('Senha obrigatória'),
})

const SignInPage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        setLoading(true)

        await signIn({
          email: data.email,
          password: data.password,
        })

        navigate('/militaries')
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description: 'Ocorreu um erro ao fazer login, cheque suas credenciais.',
        })
      } finally {
        setLoading(false)
      }
    },
    [signIn, addToast, navigate]
  )

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="Exército Brasileiro" />

          <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Faça seu logon</h1>

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  icon={FiMail}
                  placeholder="Email"
                  {...field}
                  error={errors.email?.message}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  icon={FiLock}
                  type="password"
                  placeholder="Senha"
                  {...field}
                  error={errors.password?.message}
                />
              )}
            />

            <Button type="submit" loading={loading}>
              Entrar
            </Button>

            <Link to="/forgot-password">Esqueci minha senha</Link>
          </form>

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

export { SignInPage }
