import type React from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { FiAward, FiBookmark, FiCalendar, FiPower, FiUser } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import logoImg from '../../assets/brasao.svg'
import { useAuth } from '../../hooks/auth'

import type { FormHandles } from '@unform/core'
import { Form } from '@unform/web'

import Button from '../../components/Button'
import Input from '../../components/Input'
import MilitaryDisplay from '../../components/MilitaryDisplay'
import SideBar from '../../components/Sidebar'

import {
  Container,
  Content,
  Header,
  HeaderContent,
  MainContent,
  PaginationContainer,
  Profile,
} from './styles'

const MilServices: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const formRefSearch = useRef<FormHandles>(null)

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

      <div style={{ display: 'flex', flex: 1, width: '100%' }}>
        <SideBar
          navItems={[
            { path: '/militaries', label: 'Militares' },
            { path: '/services', label: 'Serviços' },
            { path: '/forecast', label: 'Previsão' },
            { path: '/schedule', label: 'Escala de serviço' },
            { path: '/users', label: 'Usuários' },
          ]}
        />

        <Content>
          <MainContent>
            <h2>Buscar Serviço por Nome</h2>
            <Form
              ref={formRefSearch}
              onSubmit={() => {}}
              initialData={undefined}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Input
                name="searchName"
                icon={FiUser}
                type="text"
                placeholder="Nome do Serviço para busca."
              />
              <Button type="submit">Buscar por Nome</Button>

              <Button variant="info">Listar Todos os Serviços</Button>
            </Form>

            <>
              <h3>Serviços Encontrados:</h3>
              <PaginationContainer>
                <Button>Anterior</Button>
                <span>
                  Página {} de {}
                </span>
                <Button>Próxima</Button>
              </PaginationContainer>
            </>

            <h2>Cadastrar Novo Serviço</h2>
            <Form
              ref={formRef}
              onSubmit={() => {}}
              initialData={undefined}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Input name="name" icon={FiUser} placeholder="Nome do Serviço" />
              <Input
                name="description"
                icon={FiAward}
                placeholder="Natureza do Serviço"
              />
              <Button type="submit">{'Cadastrar Serviço'}</Button>
              <Button
                type="button"
                onClick={() => {
                  formRef.current?.reset()
                }}
                variant="danger"
              >
                Cancelar Edição
              </Button>
            </Form>
          </MainContent>
        </Content>
      </div>
    </Container>
  )
}

export default MilServices
