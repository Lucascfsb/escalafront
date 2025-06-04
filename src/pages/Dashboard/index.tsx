import type React from 'react'

import { FiPower } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import logoImg from '../../assets/brasao.svg'
import { useAuth } from '../../hooks/auth'
import { Container, Header, HeaderContent, Profile } from './styles'

const Dashboard: React.FC = () => {
  const { signOut, user } = useAuth()

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
    </Container>
  )
}
/*return (
    <Container>
      <img src={logoImg} alt="Exército Brasilero" />

      <Sidebar>
        <nav>
          <ul>
            <li>Militares</li>
            <li>Serviços</li>
            <li>Previsão</li>
            <li>Escala de serviço</li>
          </ul>
        </nav>
      </Sidebar>

      <Content>
        <Header>
          <h1>Painel de Controle</h1>
          <div>
            <span>Bem-vindo, Usuário</span>
            <Button>Sair</Button>
          </div>
        </Header>

        <MainContent>Oi</MainContent>
      </Content>
    </Container>
  )
}*/

export default Dashboard
