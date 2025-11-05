import { yupResolver } from '@hookform/resolvers/yup'
import type React from 'react'
import { useCallback, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FiLock } from 'react-icons/fi'
import { useLocation, useNavigate } from 'react-router-dom'
import { useToast } from '../../hooks/toast'
import type { ResetPasswordFormData } from './types'

import logoImg from '../../assets/brasao.svg'

import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { ResetPasswordSchema } from './schema'

import { api } from '../../services/apiClient'
import { AnimationContainer, Background, Container, Content } from './styles'

const ResetPasswordPage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(ResetPasswordSchema),
  })

  const onSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        setLoading(true)

        const { password, password_confirmation } = data
        const token = new URLSearchParams(location.search).get('token')

        if (!token) {
          addToast({
            type: 'error',
            title: 'Erro ao resetar senha',
            description: 'Token de redefinição não encontrado.',
          })
          return
        }

        await api.post('/password/reset', {
          password,
          password_confirmation,
          token,
        })

        addToast({
          type: 'success',
          title: 'Senha redefinida!',
          description: 'Sua senha foi alterada com sucesso. Você já pode fazer login!',
        })

        navigate('/')
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro ao resetar senha',
          description:
            'Ocorreu um erro ao resetar sua senha, verifique o token e tente novamente.',
        })
      } finally {
        setLoading(false)
      }
    },
    [addToast, navigate, location.search]
  )

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="Exército Brasileiro" />

          <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Resetar senha</h1>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  icon={FiLock}
                  type="password"
                  placeholder="Nova senha"
                  {...field}
                  error={errors.password?.message}
                />
              )}
            />
            <Controller
              name="password_confirmation"
              control={control}
              render={({ field }) => (
                <Input
                  icon={FiLock}
                  type="password"
                  placeholder="Confirmação da senha"
                  {...field}
                  error={errors.password_confirmation?.message}
                />
              )}
            />

            <Button type="submit" loading={loading}>
              Alterar senha
            </Button>
          </form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  )
}

export { ResetPasswordPage }
