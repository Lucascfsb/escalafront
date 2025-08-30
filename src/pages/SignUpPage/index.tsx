import type { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import type React from 'react'
import { FiArrowLeft, FiChevronDown, FiLock, FiMail, FiUser } from 'react-icons/fi'
import * as Yup from 'yup'

import { api } from '../../services/apiClient'

import { useToast } from '../../hooks/toast'

import { getValidationErrors } from '../../utils/getValidationErrors'

import logoImg from '../../assets/brasao.svg'

import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { Select } from '../../components/Select'

import { useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SignUpPageSchema } from './schema'
import { AnimationContainer, Background, Container, Content } from './styles'

interface SignUpFormData {
  username: string
  email: string
  password: string
  password_confirmation: string
  role: string
}

const SignUpPage: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({})

        await SignUpPageSchema.validate(data, {
          abortEarly: false,
        })

        await api.post('/users', data)

        navigate('/')

        addToast({
          type: 'success',
          title: 'Cadastro realizado!',
          description: 'Você já pode fazer seu logon!',
        })
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)
          formRef.current?.setErrors(errors)

          return
        }

        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: 'Occoreu um erro ao fazer o cadastro, tente novamente!',
        })
      }
    },
    [addToast, navigate]
  )

  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="Exército Brasilero" />

          <Form
            ref={formRef}
            onSubmit={handleSubmit}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <h1>Faça seu Cadastro</h1>
            <Input name="username" icon={FiUser} placeholder="Nome de Usuário" />
            <Input name="email" icon={FiMail} placeholder="Email" />
            <Input name="password" icon={FiLock} type="password" placeholder="Senha" />
            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              placeholder="Confirmação de Senha"
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

            <Button type="submit">Cadastrar</Button>
          </Form>

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
