import type React from 'react'
import { FiPower } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import logoImg from '../../assets/brasao.svg'
import { useAuth } from '../../hooks/auth'
import {Sidebar} from '../Sidebar'
import { Container, Content, Header, HeaderContent, Profile } from './styles'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { signOut, user } = useAuth()

  // Defina os itens de navegação aqui ou passe-os como uma prop se eles variarem significativamente por página
  const navItems = [
    { path: '/militaries', label: 'Militares' },
    { path: '/services', label: 'Serviços' },
    { path: '/forecast', label: 'Previsão' },
    { path: '/schedule', label: 'Escala de serviço' },
    { path: '/users', label: 'Usuários' },
  ]

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="Exército Brasileiro" />

          <Profile>
            <img src={user.avatar_url} alt={user.username} />
            <div>
              <span>Bem-vindo</span>
              <Link to="/profile">
                <strong>{user.username}</strong>
              </Link>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <div style={{ display: 'flex', flex: 1, width: '100%' }}>
        <Sidebar navItems={navItems} />
        <Content>{children}</Content>
      </div>
    </Container>
  )
}

export { Layout }
