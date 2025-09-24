import { yupResolver } from '@hookform/resolvers/yup'
import type React from 'react'
import { useCallback, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  FiArrowLeft,
  FiCamera,
  FiChevronDown,
  FiLock,
  FiMail,
  FiUser,
} from 'react-icons/fi'

import { api } from '../../services/apiClient'

import { useToast } from '../../hooks/toast'

import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { SelectSearch } from '../../components/SelectSearch'
import { ProfilePageSchema } from './schema'

import type { ChangeEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/auth'
import { AvataInput, Container, Content } from './styles'

interface ProfileUpdateData {
  username: string
  email: string
  role: string
  oldPassword: string
  password?: string
  passwordConfirmation?: string
}

export type FormInput = {
  username: string
  email: string
  role: {
    value: string
    label: string
  }
  oldPassword?: string
  password?: string
  passwordConfirmation?: string
}

const ProfilePage: React.FC = () => {
  const { addToast } = useToast()
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()

  const getRoleOption = (role: string) => {
    switch (role) {
      case 'admin':
        return { value: 'admin', label: 'Administrador' }
      case 'usuário':
        return { value: 'usuário', label: 'Usuário' }
      case 'consulta':
        return { value: 'consulta', label: 'Consulta' }
      default:
        return { value: '', label: 'Selecione um nível de acesso' }
    }
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: yupResolver(ProfilePageSchema),
    defaultValues: {
      username: user.username,
      email: user.email,
      role: getRoleOption(user.role),
      oldPassword: '',
      password: '',
      passwordConfirmation: '',
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = useCallback(
    async (data: FormInput) => {
      try {
        setIsSubmitting(true)
        const { username, email } = data

        const updatedProfileData: ProfileUpdateData = {
          username,
          email,
          role: data.role.value,
          oldPassword: data.oldPassword || '',
        }

        if (data.password) {
          updatedProfileData.password = data.password
          updatedProfileData.passwordConfirmation = data.passwordConfirmation
        }

        const response = await api.put('/profile', updatedProfileData)
        updateUser(response.data)

        navigate('/militaries')

        addToast({
          type: 'success',
          title: 'Perfil atualizado!',
          description: 'Suas informações foram atualizadas!',
        })
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro na atualização',
          description: 'Ocorreu um erro ao atualizar o perfil, tente novamente!',
        })
      } finally {
        setIsSubmitting(false)
      }
    },
    [addToast, navigate, updateUser]
  )

  const handleAvatarChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      try {
        if (!e.target.files || e.target.files.length === 0) {
          return
        }
        const file = e.target.files[0]
        const data = new FormData()
        data.append('avatar', file)

        const response = await api.patch('/users/avatar', data)
        updateUser(response.data)

        addToast({
          type: 'success',
          title: 'Avatar atualizado!',
        })
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro ao atualizar avatar',
          description: 'Ocorreu um erro ao atualizar seu avatar, tente novamente!',
        })
      }
    },
    [addToast, updateUser]
  )

  return (
    <Container>
      <header>
        <div>
          <Link to="/militaries">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <form onSubmit={handleSubmit(onSubmit)}>
          <AvataInput>
            <img src={user.avatar_url} alt={user.username} />
            <label htmlFor="avatar">
              <FiCamera />
              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvataInput>

          <h1>Meu perfil</h1>

          <Controller
            name="username"
            control={control}
            render={({ field }) => {
              return (
                <Input
                  icon={FiUser}
                  placeholder="Nome de Usuário"
                  {...field}
                  error={errors.username?.message}
                />
              )
            }}
          />
          <Controller
            name="email"
            control={control}
            render={({ field }) => {
              return (
                <Input
                  icon={FiMail}
                  type="email"
                  placeholder="Email"
                  {...field}
                  error={errors.email?.message}
                />
              )
            }}
          />

          <Controller
            name="oldPassword"
            control={control}
            render={({ field }) => {
              return (
                <Input
                  $containerStyle={{ marginTop: 24 }}
                  icon={FiLock}
                  type="password"
                  placeholder="Senha atual"
                  {...field}
                  error={errors.oldPassword?.message}
                />
              )
            }}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => {
              return (
                <Input
                  icon={FiLock}
                  type="password"
                  placeholder="Nova senha"
                  {...field}
                  error={errors.password?.message}
                />
              )
            }}
          />
          <Controller
            name="passwordConfirmation"
            control={control}
            render={({ field }) => {
              return (
                <Input
                  icon={FiLock}
                  type="password"
                  placeholder="Confirmar senha"
                  {...field}
                  error={errors.passwordConfirmation?.message}
                />
              )
            }}
          />
          <Controller
            name="role"
            control={control}
            render={({ field }) => {
              return (
                <SelectSearch
                  icon={FiChevronDown}
                  options={[
                    { value: 'admin', label: 'Administrador' },
                    { value: 'usuário', label: 'Usuário' },
                    { value: 'consulta', label: 'Consulta' },
                  ]}
                  {...field}
                />
              )
            }}
          />

          <Button type="submit" loading={isSubmitting}>
            Confirmar mudanças
          </Button>
        </form>
      </Content>
    </Container>
  )
}

export { ProfilePage }
