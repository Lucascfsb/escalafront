import { yupResolver } from '@hookform/resolvers/yup'
import type React from 'react'
import { useCallback, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FiArrowLeft, FiChevronDown, FiLock, FiMail, FiUser } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

import { api } from '../../services/apiClient'

import { useToast } from '../../hooks/toast'

import logoImg from '../../assets/brasao.svg'

import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { SelectSearch } from '../../components/SelectSearch'

import { AnimationContainer, Background, Container, Content } from './styles'

interface SignUpFormData {
  username: string
  email: string
  password: string
  password_confirmation: string
  role: string
}

const SignUpPageSchema = Yup.object().shape({
  username: Yup.string().required('Nome de Usuário obrigatório'),
  email: Yup.string().required('E-mail obrigatório').email('Digite um E-mail válido'),
  password: Yup.string()
    .min(6, 'A senha deve ter no mínimo 6 dígitos')
    .required('Senha obrigatória'),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Confirmação de senha incorreta')
    .required('Confirmação de senha obrigatória'),
  role: Yup.string().required('Selecione seu nível de acesso'),
})

const SignUpPage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()
  const navigate = useNavigate()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(SignUpPageSchema),
  })

  const onSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        setLoading(true)
        await api.post('/users', data)

        navigate('/')

        addToast({
          type: 'success',
          title: 'Cadastro realizado!',
          description: 'Você já pode fazer seu logon!',
        })
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: 'Ocorreu um erro ao fazer o cadastro, tente novamente!',
        })
      } finally {
        setLoading(false)
      }
    },
    [addToast, navigate]
  )

  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="Exército Brasileiro" />

          <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Faça seu Cadastro</h1>

            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <Input
                  icon={FiUser}
                  placeholder="Nome de Usuário"
                  {...field}
                  error={errors.username?.message}
                />
              )}
            />
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
            <Controller
              name="password_confirmation"
              control={control}
              render={({ field }) => (
                <Input
                  icon={FiLock}
                  type="password"
                  placeholder="Confirmação de Senha"
                  {...field}
                  error={errors.password_confirmation?.message}
                />
              )}
            />
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <SelectSearch
                  icon={FiChevronDown}
                  options={[
                    { value: 'admin', label: 'Administrador' },
                    { value: 'usuário', label: 'Usuário' },
                    { value: 'consulta', label: 'Consulta' },
                  ]}
                  {...field}
                />
              )}
            />

            <Button type="submit" loading={loading}>
              Cadastrar
            </Button>
          </form>

          <Link to="/">
            <FiArrowLeft />
            Voltar para logon
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  )
}

export { SignUpPage }
