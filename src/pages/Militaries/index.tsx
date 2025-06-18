import type { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import axios from 'axios'
import { format, isValid, parse, parseISO } from 'date-fns' // Adicionado 'isValid'
import type React from 'react'

import { useCallback, useRef, useState } from 'react'
import { FiAward, FiBookmark, FiCalendar, FiEdit, FiPower, FiUser } from 'react-icons/fi'
import { Link, useLocation } from 'react-router-dom'

import * as Yup from 'yup'
import logoImg from '../../assets/brasao.svg'
import { useAuth } from '../../hooks/auth'
import { useToast } from '../../hooks/toast'
import api from '../../services/apiClient'
import getValidationErrors from '../../utils/getValidationErrors'

import Button from '../../components/Button'
import Input from '../../components/Input'

import {
  Container,
  Content,
  Header,
  HeaderContent,
  MainContent,
  Profile,
  Sidebar,
} from './styles'

interface Military {
  id: string
  name: string
  rank: string
  qualification: string
  date_of_entry: string
  created_at: string
  update_at: string
}

interface MilitaryFormData {
  name: string
  rank: string
  qualification: string
  date_of_entry: string
}

interface SearchFormData {
  searchName: string
}

const Militaries: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const formRefSearch = useRef<FormHandles>(null)
  const { signOut, user } = useAuth()
  const { addToast } = useToast()
  const location = useLocation()

  const [newMilitaryData, setNewMilitaryData] = useState<MilitaryFormData>({
    name: '',
    rank: '',
    qualification: '',
    date_of_entry: '',
  })
  const [foundMilitary, setFoundMilitary] = useState<Military | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [editingMilitaryId, setEditingMilitaryId] = useState<string | null>(null)
  const [lastSearchName, setLastSearchName] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  )

  const reloadFoundMilitary = useCallback(async () => {
    if (lastSearchName) {
      setError(null)
      setFoundMilitary(null)
      setIsLoading(true)
      try {
        const response = await api.get<Military>(
          `/militaries/${encodeURIComponent(lastSearchName)}`
        )
        setFoundMilitary(response.data)
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setFoundMilitary(null)
          setError(
            'Militar não encontrado após recarga. Pode ter sido deletado ou nome alterado.'
          )
        } else {
          console.error('Erro ao recarregar militar:', err)
          setError('Erro ao recarregar militar. Tente novamente.')
          addToast({
            type: 'error',
            title: 'Erro na Recarga',
            description: 'Não foi possível recarregar os dados do militar.',
          })
        }
      } finally {
        setIsLoading(false)
      }
    }
  }, [lastSearchName, addToast])

  const handleSubmitMilitary = useCallback(
    async (data: MilitaryFormData) => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome é obrigatório'),
          rank: Yup.string().required('Patente é obrigatória'),
          qualification: Yup.string().required('Qualificação é obrigatória'),
          date_of_entry: Yup.string()
            .required('Data de entrada é obrigatória')
            .matches(
              /^\d{4}-\d{2}-\d{2}$/,
              'Formato de data inválido. Use AAAA-MM-DD (ex: 1994-04-06).'
            )
            .test('is-valid-date', 'Data inválida ou inexistente', value => {
              if (!value) return false
              // Usa parse e isValid do date-fns para validação robusta
              const parsedDate = parse(value, 'yyyy-MM-dd', new Date())
              return isValid(parsedDate)
            }),
        })

        await schema.validate(data, {
          abortEarly: false,
        })

        setIsLoading(true)

        const dataToSave = {
          name: data.name,
          rank: data.rank,
          qualification: data.qualification,
          date_of_entry: data.date_of_entry,
        }

        if (editingMilitaryId) {
          const response = await api.put<Military>(`/militaries/${editingMilitaryId}`, {
            ...dataToSave,
            update_at: new Date().toISOString(),
          })
          addToast({
            type: 'success',
            title: 'Militar Atualizado',
            description: 'Os dados do militar foram atualizados com sucesso!',
          })
          setFoundMilitary(response.data)
          setLastSearchName(response.data.name)
        } else {
          await api.post('/militaries', {
            ...dataToSave,
            created_at: new Date().toISOString(),
            update_at: new Date().toISOString(),
          })
          addToast({
            type: 'success',
            title: 'Militar Cadastrado',
            description: 'Novo militar cadastrado com sucesso!',
          })
          setFoundMilitary(null)
          setLastSearchName('')
        }

        setEditingMilitaryId(null)
        setNewMilitaryData({ name: '', rank: '', qualification: '', date_of_entry: '' })
        formRef.current?.reset()
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)
          formRef.current?.setErrors(errors)
          addToast({
            type: 'error',
            title: 'Erro de Validação',
            description: 'Verifique os campos do formulário.',
          })
          return
        }
        addToast({
          type: 'error',
          title: `Erro ao ${editingMilitaryId ? 'atualizar' : 'cadastrar'} militar`,
          description: 'Ocorreu um erro. Tente novamente ou verifique os dados.',
        })
      } finally {
        setIsLoading(false)
      }
    },
    [editingMilitaryId, addToast]
  )

  const handleSearchMilitary = useCallback(
    async (data: SearchFormData) => {
      setError(null)
      setFoundMilitary(null)

      const searchNameValue = data.searchName.trim()

      if (!searchNameValue) {
        setError('Por favor, insira um nome para buscar.')
        addToast({
          type: 'info',
          title: 'Busca Vazia',
          description: 'Por favor, insira um nome para buscar.',
        })
        return
      }

      setIsLoading(true)

      try {
        const response = await api.get<Military>(
          `/militaries/${encodeURIComponent(searchNameValue)}`
        )
        setFoundMilitary(response.data)
        setLastSearchName(searchNameValue)

        addToast({
          type: 'success',
          title: 'Militar Encontrado',
          description: `Militar "${response.data.name}" encontrado.`,
        })
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError('Militar não encontrado.')
          setLastSearchName('')

          addToast({
            type: 'error',
            title: 'Militar Não Encontrado',
            description: `Nenhum militar com o nome "${searchNameValue}" foi encontrado.`,
          })
        } else {
          setError('Erro ao buscar militar. Tente novamente.')
          setLastSearchName('')

          addToast({
            type: 'error',
            title: 'Erro na Busca',
            description: 'Ocorreu um erro ao buscar o militar.',
          })
        }
      } finally {
        setIsLoading(false)
      }
    },
    [addToast]
  )

  const handleEditMilitary = useCallback((military: Military) => {
    setEditingMilitaryId(military.id)

    const dateForInput = format(parseISO(military.date_of_entry), 'yyyy-MM-dd')

    formRef.current?.setData({
      name: military.name,
      rank: military.rank,
      qualification: military.qualification,
      date_of_entry: dateForInput,
    })
    setNewMilitaryData({
      name: military.name,
      rank: military.rank,
      qualification: military.qualification,
      date_of_entry: dateForInput,
    })
  }, [])

  const handleDeleteMilitary = useCallback(
    async (id: string) => {
      if (!window.confirm('Tem certeza que deseja deletar este militar?')) {
        return
      }
      setError(null)
      setIsLoading(true)

      try {
        await api.delete(`/militaries/${id}`)
        addToast({
          type: 'success',
          title: 'Militar Deletado',
          description: 'Militar removido com sucesso!',
        })
        setFoundMilitary(null)
        setLastSearchName('')
      } catch (err) {
        setError('Erro ao deletar militar.')
        addToast({
          type: 'error',
          title: 'Erro ao Deletar',
          description: 'Não foi possível deletar o militar. Tente novamente.',
        })
      } finally {
        setIsLoading(false)
      }
    },
    [addToast]
  )

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
        <Sidebar>
          <img src={logoImg} alt="Exército Brasileiro" />

          <nav>
            <ul>
              <li className={isActive('/militaries') ? 'active' : ''}>
                <Link to="/militaries">Militares</Link>
              </li>
              <li className={isActive('/services') ? 'active' : ''}>
                <Link to="/services">Serviços</Link>
              </li>
              <li className={isActive('/users') ? 'active' : ''}>
                <Link to="/users">Usuários</Link>
              </li>
              <li className={isActive('/forecast') ? 'active' : ''}>
                <Link to="/forecast">Previsão</Link>
              </li>
              <li className={isActive('/schedule') ? 'active' : ''}>
                <Link to="/schedule">Escala de serviço</Link>
              </li>
            </ul>
          </nav>
        </Sidebar>

        <Content>
          <MainContent>
            {error && <p style={{ color: '#c53030', marginBottom: '20px' }}>{error}</p>}
            {isLoading && (
              <p style={{ color: '#007bff', marginBottom: '20px' }}>Carregando...</p>
            )}

            <h2>{editingMilitaryId ? 'Atualizar Militar' : 'Cadastrar Novo Militar'}</h2>
            <Form
              ref={formRef}
              onSubmit={handleSubmitMilitary}
              initialData={newMilitaryData}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Input name="name" icon={FiUser} placeholder="Nome de Guerra" />
              <Input
                name="rank"
                icon={FiBookmark}
                placeholder="Patente (Sd, Cb, Sgt, etc.)"
              />
              <Input
                name="qualification"
                icon={FiAward}
                placeholder="Qualificação (Especialização, Combatente, etc.)"
              />
              <Input
                name="date_of_entry"
                icon={FiCalendar}
                type="text"
                placeholder="DD/MM/AAAA"
                mask="99/99/9999"
              />

              <Button type="submit">
                {editingMilitaryId ? <FiEdit /> : null}{' '}
                {editingMilitaryId ? 'Salvar Alterações' : 'Cadastrar Militar'}
              </Button>
              {editingMilitaryId && (
                <Button
                  type="button"
                  onClick={() => {
                    setEditingMilitaryId(null)
                    setNewMilitaryData({
                      name: '',
                      rank: '',
                      qualification: '',
                      date_of_entry: '',
                    })
                    formRef.current?.reset()
                  }}
                  style={{ background: '#999591', marginTop: '10px' }}
                >
                  Cancelar Edição
                </Button>
              )}
            </Form>

            <h2>Buscar Militar por Nome</h2>
            <Form
              ref={formRefSearch}
              onSubmit={handleSearchMilitary}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Input
                name="searchName"
                icon={FiUser}
                type="text"
                placeholder="Nome do Militar para busca."
              />
              <Button type="submit" disabled={isLoading}>
                Buscar
              </Button>
            </Form>

            {foundMilitary && (
              <div className="military-details">
                <div className="military-info-details">
                  <h3>Detalhes do Militar Encontrado:</h3>
                  <p>
                    <strong>Nome:</strong> {foundMilitary.name}
                  </p>
                  <p>
                    <strong>Patente:</strong> {foundMilitary.rank}
                  </p>
                  <p>
                    <strong>Qualificação:</strong> {foundMilitary.qualification}
                  </p>
                  <p>
                    <strong>Data de Entrada: </strong>
                    {new Date(foundMilitary.date_of_entry).toLocaleDateString()}
                  </p>
                </div>
                <div className="button-group">
                  <Button onClick={() => handleEditMilitary(foundMilitary)}>
                    Editar
                  </Button>
                  <Button onClick={() => handleDeleteMilitary(foundMilitary.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </MainContent>
        </Content>
      </div>
    </Container>
  )
}

export default Militaries
