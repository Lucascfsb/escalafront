import type { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import axios from 'axios'
import { format, isValid, parse, parseISO } from 'date-fns'
import type React from 'react'

import { useCallback, useMemo, useRef, useState } from 'react'
import { FiAward, FiBookmark, FiCalendar, FiUser } from 'react-icons/fi'

import * as Yup from 'yup'
import { useToast } from '../../hooks/toast'
import api from '../../services/apiClient'
import getValidationErrors from '../../utils/getValidationErrors'

import Button from '../../components/Button'
import MilitaryDisplay from '../../components/InfoDisplay/Display/MilitaryDisplay'
import Input from '../../components/Input'
import Layout from '../../components/Layout'
import Pagination from '../../components/Pagination'

import { MainContent } from './styles'

export interface Military {
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
  const { addToast } = useToast()

  const [newMilitaryData, setNewMilitaryData] = useState<MilitaryFormData>({
    name: '',
    rank: '',
    qualification: '',
    date_of_entry: '',
  })
  const [allMilitaries, setAllMilitaries] = useState<Military[]>([])
  const [currentSearchTerm, setCurrentSearchTerm] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [editingMilitaryId, setEditingMilitaryId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [militariesLoaded, setMilitariesLoaded] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  const totalPages = useMemo(() => {
    return Math.ceil(allMilitaries.length / itemsPerPage)
  }, [allMilitaries])

  const displayedMilitaries = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return allMilitaries.slice(startIndex, endIndex)
  }, [allMilitaries, currentPage])

  const fetchMilitaries = useCallback(
    async (name?: string) => {
      setError(null)
      setIsLoading(true)
      try {
        let url = '/militaries'
        if (name) {
          url = `/militaries?name=${encodeURIComponent(name)}`
        }

        const response = await api.get<Military[]>(url)
        console.log('Resposta da API:', response.data)
        setAllMilitaries(response.data)
        setMilitariesLoaded(true)
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError(`Nenhum militar encontrado ${name ? `com o nome "${name}"` : ''}.`)
          addToast({
            type: 'error',
            title: 'Erro ao Carregar',
            description: `Nenhum militar foi encontrado ou houve um erro na busca ${name ? `com o nome "${name}"` : ''}.`,
          })
        } else {
          setError('Erro ao carregar militares. Tente novamente.')
          addToast({
            type: 'error',
            title: 'Erro de Conexão',
            description: 'Não foi possível carregar os dados dos militares.',
          })
        }
        setAllMilitaries([])
        setMilitariesLoaded(false)
      } finally {
        setIsLoading(false)
      }
    },
    [addToast]
  )

  const reloadDataAndResetPage = useCallback(async () => {
    setCurrentPage(1)
    await fetchMilitaries(currentSearchTerm || undefined)
  }, [currentSearchTerm, fetchMilitaries])

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
          await api.put<Military>(`/militaries/${editingMilitaryId}`, {
            ...dataToSave,
            update_at: new Date().toISOString(),
          })
          addToast({
            type: 'success',
            title: 'Militar Atualizado',
            description: 'Os dados do militar foram atualizados com sucesso!',
          })
          await reloadDataAndResetPage()
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
          await reloadDataAndResetPage()
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
    [editingMilitaryId, addToast, reloadDataAndResetPage]
  )

  const handleSearchMilitary = useCallback(
    async (data: SearchFormData) => {
      const searchNameValue = data.searchName.trim()

      if (!searchNameValue) {
        addToast({
          type: 'info',
          title: 'Campo de Busca Vazio',
          description: 'Por favor, digite um nome para buscar.',
        })
        return
      }

      setCurrentSearchTerm(searchNameValue)
      await fetchMilitaries(searchNameValue)
      formRefSearch.current?.reset()
    },
    [addToast, fetchMilitaries]
  )

  const handleListAllMilitaries = useCallback(async () => {
    setCurrentSearchTerm('')
    formRefSearch.current?.reset()
    await fetchMilitaries()
  }, [fetchMilitaries])

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
        await reloadDataAndResetPage()
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
    [addToast, reloadDataAndResetPage]
  )

  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages || page === currentPage) return
      setCurrentPage(page)
    },
    [currentPage, totalPages]
  )

  return (
    <Layout>
      <MainContent>
        {error && <p>{error}</p>}
        {isLoading && <p>Carregando...</p>}

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
            Buscar por Nome
          </Button>

          <Button onClick={handleListAllMilitaries} disabled={isLoading} variant="info">
            Listar Todos os Militares
          </Button>
        </Form>

        {militariesLoaded && (
          <>
            <h3>
              {currentSearchTerm
                ? `Militares Encontrados (${allMilitaries.length} total)`
                : `Todos os Militares (${allMilitaries.length} total)`}
            </h3>

            {allMilitaries.length > 0 ? (
              <div>
                {displayedMilitaries.map(military => (
                  <MilitaryDisplay
                    key={military.id}
                    military={military}
                    onEdit={handleEditMilitary}
                    onDelete={handleDeleteMilitary}
                  />
                ))}
              </div>
            ) : (
              <p>Nenhum militar encontrado</p>
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isLoading={isLoading}
              />
            )}
          </>
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
              variant="danger"
            >
              Cancelar Edição
            </Button>
          )}
        </Form>
      </MainContent>
    </Layout>
  )
}

export default Militaries
