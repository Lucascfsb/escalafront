import type React from 'react'
import { FiLock, FiLogIn, FiMail } from 'react-icons/fi'

import logoImg from '../../assets/brasao.svg'

import Button from '../../components/Button'
import Input from '../../components/Input'

import { Background, Container, Content } from './styles'

const SignIn: React.FC = () => (
  <Container>
    <Content>
      <img src={logoImg} alt="Exército Brasilero" />

      <form>
        <h1>Faça seu logon</h1>
        <Input name="email" icon={FiMail} placeholder="Email" />
        <Input name="password" icon={FiLock} type="password" placeholder="Senha" />

        <Button type="submit">Entrar</Button>

        <a href="forgot">Esqueci minha senha</a>
      </form>

      <a href="login">
        <FiLogIn />
        Criar conta
      </a>
    </Content>
    <Background />
  </Container>
)

export default SignIn
