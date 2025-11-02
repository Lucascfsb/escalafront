import axios from 'axios'
import type React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useToast } from '../../hooks/toast'
import { api } from '../../services/apiClient'

import { MilitaryForm } from '../../components/Forms/MilitaryForm'
import { MilitaryGrid } from '../../components/Grid/MilitaryGrid'
import { Layout } from '../../components/Layout'
import { MilitaryList } from '../../components/List/MilitaryList/MilitaryList'
import { Modal } from '../../components/Modal/index'
import { Pagination } from '../../components/Pagination/index'
import { MilitarySearch } from '../../components/Search/Search'

import { format, parseISO } from 'date-fns'
import { FiGrid, FiList, FiPlus } from 'react-icons/fi'
import { Button } from '../../components/Button'
import { ButtonContainer, MainContent } from './styles'
import type { Military, MilitaryFormData, ViewMode } from './types'

export const MilitariesPage: React.FC = () => {
  const { addToast } = useToast()

  const [viewMode, setViewMode] = useState<ViewMode>('card')

  const [allMilitaries, setAllMilitaries] = useState<Military[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [militaryToEdit, setMilitaryToEdit] = useState<Military | null>(null)
  const [militaryForActions, setMilitaryForActions] = useState<Military | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPageOptions = useMemo(() => [12, 24, 40], [])
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0])

  const totalPages = useMemo(() => {
    return Math.ceil(allMilitaries.length / itemsPerPage)
  }, [allMilitaries, itemsPerPage])

  const displayedMilitaries = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return allMilitaries.slice(startIndex, endIndex)
  }, [allMilitaries, currentPage, itemsPerPage])

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

  const handleItemsPerPageChange = useCallback((value: string) => {
    const newItemsPerPage = Number(value)
    setCurrentPage(1)
    setItemsPerPage(newItemsPerPage)
  }, [])

  return (
    <Layout>
      <MainContent>
        {error && <p>{error}</p>}

        <h2>
          Gerenciar Militares
          <ButtonContainer>
            <Button onClick={handleOpenCreationModal}>
              <FiPlus />
              Adicionar Militar
            </Button>
            <Button onClick={() => setViewMode('card')} isActive={viewMode === 'card'}>
              <FiGrid /> Cards
            </Button>
            <Button onClick={() => setViewMode('list')} isActive={viewMode === 'list'}>
              <FiList />
              Lista
            </Button>
          </ButtonContainer>
        </h2>

        <MilitarySearch searchTerm={searchTerm} onSearch={setSearchTerm} />

        {viewMode === 'card' ? (
          <MilitaryGrid
            militaries={displayedMilitaries}
            onIconClick={handleOpenActionsModal}
          />
        ) : (
          <MilitaryList
            militaries={displayedMilitaries}
            onIconClick={handleOpenActionsModal}
          />
        )}

        {allMilitaries.length > 0 && (
          <div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
              itemsPerPage={itemsPerPage}
              itemsPerPageOptions={itemsPerPageOptions}
              onItemsPerPageChange={handleItemsPerPageChange}
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
              <p>
                Nome: <span>{militaryForActions.name || 'Não informado'}</span>
              </p>
              <p>
                Posto/Graduação: <span>{militaryForActions.rank || 'Não informado'}</span>
              </p>
              <p>
                Qualificação:{' '}
                <span>{militaryForActions.qualification || 'Não informado'}</span>
              </p>
              <p>
                Data de Entrada:
                <span>
                  {' '}
                  {militaryForActions.date_of_entry
                    ? format(parseISO(militaryForActions.date_of_entry), 'dd/MM/yyyy')
                    : 'Não informada'}
                </span>
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
