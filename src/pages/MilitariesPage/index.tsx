import axios from 'axios'
import type React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useToast } from '../../hooks/toast'
import { api } from '../../services/apiClient'

import { Layout } from '../../components/Layout'
import { MilitaryForm } from '../../components/MilitaryForm/MilitaryForm'
import { MilitaryGrid } from '../../components/MilitaryGrid/MilitaryGrid'
import { MilitarySearch } from '../../components/MilitarySearch/MilitarySearch'
import { Modal } from '../../components/Modal/index'
import { Pagination } from '../../components/Pagination/index'

import { format, parseISO } from 'date-fns'
import { Button } from '../../components/Button'
import { ButtonContainer, MainContent } from './styles'
import type { Military, MilitaryFormData } from './types'

export const MilitariesPage: React.FC = () => {
  const { addToast } = useToast()

  const [allMilitaries, setAllMilitaries] = useState<Military[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [militaryToEdit, setMilitaryToEdit] = useState<Military | null>(null)
  const [militaryForActions, setMilitaryForActions] = useState<Military | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 24

  const totalPages = useMemo(() => {
    return Math.ceil(allMilitaries.length / itemsPerPage)
  }, [allMilitaries])

  const displayedMilitaries = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return allMilitaries.slice(startIndex, endIndex)
  }, [allMilitaries, currentPage])
  // ...

  const fetchMilitaries = useCallback(
    async (name?: string) => {
      setError(null)
      setIsLoading(true)
      try {
        const url = name ? `/militaries?name=${encodeURIComponent(name)}` : '/militaries'
        const response = await api.get<Military[]>(url)
        setAllMilitaries(response.data)
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
      } finally {
        setIsLoading(false)
      }
    },
    [addToast]
  )

  useEffect(() => {
    fetchMilitaries(searchTerm || undefined)
  }, [fetchMilitaries, searchTerm])

  const reloadDataAndResetPage = useCallback(async () => {
    setCurrentPage(1)
    await fetchMilitaries(searchTerm || undefined)
  }, [searchTerm, fetchMilitaries])

  const handleSubmitMilitary = useCallback(
    async (data: MilitaryFormData) => {
      setIsLoading(true)

      const militaryId = militaryToEdit?.id

      try {
        const dataToSave = {
          name: data.name,
          rank: data.rank,
          qualification: data.qualification,
          date_of_entry: data.date_of_entry,
        }

        if (militaryId) {
          await api.put<Military>(`/militaries/${militaryId}`, dataToSave)
          addToast({
            type: 'success',
            title: 'Militar Atualizado',
            description: 'Os dados do militar foram atualizados com sucesso!',
          })
        } else {
          await api.post('/militaries', dataToSave)
          addToast({
            type: 'success',
            title: 'Militar Cadastrado',
            description: 'Novo militar cadastrado com sucesso!',
          })
        }

        setIsFormModalOpen(false)
        setMilitaryToEdit(null)
        setMilitaryForActions(null)
        await reloadDataAndResetPage()
      } catch (err) {
        addToast({
          type: 'error',
          title: `Erro ao ${militaryId ? 'atualizar' : 'cadastrar'} militar`,
          description: 'Ocorreu um erro. Tente novamente ou verifique os dados.',
        })
      } finally {
        setIsLoading(false)
      }
    },
    [militaryToEdit, addToast, reloadDataAndResetPage]
  )

  const handleDeleteMilitary = useCallback(
    async (id: string) => {
      setError(null)
      setIsLoading(true)

      try {
        await api.delete(`/militaries/${id}`)
        addToast({
          type: 'success',
          title: 'Militar Deletado',
          description: 'Militar removido com sucesso!',
        })
        setMilitaryForActions(null)
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

  const handleOpenCreationModal = useCallback(() => {
    setMilitaryToEdit(null)
    setMilitaryForActions(null)
    setIsFormModalOpen(true)
  }, [])

  const handleOpenEditModal = useCallback((military: Military) => {
    setMilitaryToEdit(military)
    setMilitaryForActions(null)
    setIsFormModalOpen(true)
  }, [])

  const handleOpenActionsModal = useCallback((military: Military) => {
    setMilitaryForActions(military)
  }, [])

  const handleCloseFormModal = useCallback(() => {
    setIsFormModalOpen(false)
    setMilitaryToEdit(null)
  }, [])

  const handleCloseActionsModal = useCallback(() => {
    setMilitaryForActions(null)
  }, [])

  const initialData = useMemo(() => {
    if (!militaryToEdit) {
      return undefined
    }
    return {
      ...militaryToEdit,
      date_of_entry: format(parseISO(militaryToEdit.date_of_entry), 'yyyy-MM-dd'),
    } as MilitaryFormData
  }, [militaryToEdit])

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

        <h2>Gerenciar Militares</h2>

        <MilitarySearch searchTerm={searchTerm} onSearch={setSearchTerm} />
        <ButtonContainer>
          <Button onClick={handleOpenCreationModal}>Adicionar Militar</Button>
        </ButtonContainer>

        <MilitaryGrid
          militaries={displayedMilitaries}
          onIconClick={handleOpenActionsModal}
        />
        {totalPages > 1 && (
          <div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          </div>
        )}
      </MainContent>

      <Modal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        title={militaryToEdit ? 'Atualizar Militar' : 'Cadastrar Novo Militar'}
      >
        <MilitaryForm onSubmit={handleSubmitMilitary} initialData={initialData} />
      </Modal>

      {militaryForActions && (
        <Modal
          isOpen={!!militaryForActions}
          onClose={handleCloseActionsModal}
          title={`Opções de Ação: ${militaryForActions.name}`}
        >
          {militaryForActions && (
            <div>
              <h3>Detalhes do Militar:</h3>
              <p>Nome: {militaryForActions.name || 'Não informado'}</p>
              <p>Posto/Graduação: {militaryForActions.rank || 'Não informado'}</p>
              <p>Qualificação: {militaryForActions.qualification || 'Não informado'}</p>
              <p>
                Data de Entrada:{' '}
                {militaryForActions.date_of_entry
                  ? format(parseISO(militaryForActions.date_of_entry), 'dd/MM/yyyy')
                  : 'Não informada'}
              </p>
              <div
                style={{
                  marginTop: '15px',
                  display: 'flex',
                  gap: '10px',
                  justifyContent: 'center',
                }}
              >
                <Button
                  onClick={() => {
                    handleCloseActionsModal()
                    handleOpenEditModal(militaryForActions)
                  }}
                >
                  Editar Dados
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Tem certeza que deseja deletar ${militaryForActions.name}?`
                      )
                    ) {
                      handleDeleteMilitary(militaryForActions.id)
                    }
                  }}
                >
                  Remover Militar
                </Button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </Layout>
  )
}
