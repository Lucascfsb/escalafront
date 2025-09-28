import type React from 'react'
import { useCallback, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FiLogIn, FiMail } from 'react-icons/fi'
import { Link } from 'react-router-dom'

import { useToast } from '../../hooks/toast'

import logoImg from '../../assets/brasao.svg'

import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { ForgotPasswordSchema } from './schema'

import { yupResolver } from '@hookform/resolvers/yup'
import { api } from '../../services/apiClient'
import { AnimationContainer, Background, Container, Content } from './styles'

interface ForgotPasswordFormData {
  email: string
}

const ForgotPasswordPage: React.FC = () => {
  const [loading, setLoading] = useState(false)

  const { addToast } = useToast()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(ForgotPasswordSchema),
  })

  const onSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        setLoading(true)

        await api.post('password/forgot', {
          email: data.email,
        })

        addToast({
          type: 'success',
          title: 'E-mail de recuperação enviado',
          description:
            'Enviamos um e-mail para confirmar a recuperação de senha, cheque sua caixa de entrada!',
        })
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro ao recuperar a senha',
          description:
            'Ocorreu um erro ao realizar a recuperação de senha, verifique o e-mail informado.',
        })
      } finally {
        setLoading(false)
      }
    },
    [addToast]
  )

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="Exército Brasilero" />

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

            <Button loading={loading} type="submit">
              Recuperar
            </Button>
          </form>

          <Link to="/">
            <FiLogIn />
            Voltar ao login
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  )
}

export { ForgotPasswordPage }
