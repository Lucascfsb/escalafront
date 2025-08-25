import type { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import type React from 'react'
import {
  FiArrowLeft,
  FiCamera,
  FiChevronDown,
  FiLock,
  FiMail,
  FiUser,
} from 'react-icons/fi'
import * as Yup from 'yup'

import {api} from '../../services/apiClient'

import { useToast } from '../../hooks/toast'

import {getValidationErrors} from '../../utils/getValidationErrors'

import {Button} from '../../components/Button'
import {Input} from '../../components/Input'
import {Select} from '../../components/Select'

import { useCallback, useRef } from 'react'
import type { ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/auth'
import { AvataInput, Container, Content } from './styles'

interface ProfileFormData {
  username: string
  email: string
  password: string
  role: string
  oldPassword?: string
  passwordConfirmation?: string
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          username: Yup.string().required('Nome de Usuário obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um E-mail válido'),
          oldPassword: Yup.string(),
          password: Yup.string().test(
            'password-required',
            'Nova senha obrigatória',
            function (value) {
              return !this.parent.oldPassword || !!value
            }
          ),
          passwordConfirmation: Yup.string()
            .test('password-match', 'Confirmação incorreta', function (value) {
              return !this.parent.password || value === this.parent.password
            })
            .test(
              'confirmation-required',
              'Confirmação de senha obrigatória',
              function (value) {
                return !this.parent.password || !!value
              }
            ),
          role: Yup.string().required('Selecione seu nível de acesso'),
        })

        await schema.validate(data, {
          abortEarly: false,
        })

        await api.put('/profile', data).then(response => {
          updateUser(response.data)
        })

        navigate('/militaries')

        addToast({
          type: 'success',
          title: 'Perfil atualizado!',
          description: 'Suas informações foram atualizadas!',
        })
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)
          formRef.current?.setErrors(errors)

          return
        }

        addToast({
          type: 'error',
          title: 'Erro na atualização',
          description: 'Occoreu um erro ao atualizaro perfil, tente novamente!',
        })
      }
    },
    [addToast, navigate, updateUser]
  )

  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData()

        data.append('avatar', e.target.files[0])

        api.patch('/users/avatar', data).then(response => {
          updateUser(response.data)
          addToast({
            type: 'success',
            title: 'Avatar atualizado!',
          })
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
        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          initialData={{
            username: user.username,
            email: user.email,
          }}
        >
          <AvataInput>
            <img src={user.avatar_url} alt={user.username} />
            <label htmlFor="avatar">
              <FiCamera />
              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvataInput>

          <h1>Meu perfil</h1>

          <Input name="username" icon={FiUser} placeholder="Nome de Usuário" />
          <Input name="email" icon={FiMail} type="email" placeholder="Email" />
          <Input
            $containerStyle={{ marginTop: 24 }}
            name="oldPassword"
            icon={FiLock}
            type="password"
            placeholder="Senha atual"
          />
          <Input name="password" icon={FiLock} type="password" placeholder="Nova senha" />
          <Input
            name="passwordConfirmation"
            icon={FiLock}
            type="password"
            placeholder="Confirmar senha"
          />
          <Select
            name="role"
            icon={FiChevronDown}
            options={[
              { value: 'admin', label: 'Administrador' },
              { value: 'usuário', label: 'Usuário' },
              { value: 'consulta', label: 'Consulta' },
            ]}
          />

          <Button type="submit">Confirmar mudanças</Button>
        </Form>
      </Content>
    </Container>
  )
}

export {Profile}