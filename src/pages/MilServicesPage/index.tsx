import axios from 'axios'
import type React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useToast } from '../../hooks/toast'
import { api } from '../../services/apiClient'

import { MilServicesForm } from '../../components/Forms/MilServiceForm'
import { ServiceGrid } from '../../components/Grid/ServiceGrid'
import { Layout } from '../../components/Layout'
import { ServiceList } from '../../components/List/MilServiceList/ServiceList'
import { Modal } from '../../components/Modal/index'
import { Pagination } from '../../components/Pagination/index'
import { ServiceSearch } from '../../components/Search/Search'

import { format, parseISO } from 'date-fns'
import { FiGrid, FiList, FiPlus } from 'react-icons/fi'
import { Button } from '../../components/Button'
import { ButtonContainer, MainContent } from './styles'
import type { ServiceFormData, ServiceType, ViewMode } from './types'

export const MilServicesPage: React.FC = () => {
  const { addToast } = useToast()

  const [viewMode, setViewMode] = useState<ViewMode>('card')

  const [allServices, setAllServices] = useState<ServiceType[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [serviceToEdit, setServiceToEdit] = useState<ServiceType | null>(null)
  const [serviceForActions, setServiceForActions] = useState<ServiceType | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPageOptions = useMemo(() => [12, 24, 40], [])
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0])

  const totalPages = useMemo(() => {
    return Math.ceil(allServices.length / itemsPerPage)
  }, [allServices, itemsPerPage])

  const displayedServices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return allServices.slice(startIndex, endIndex)
  }, [allServices, currentPage, itemsPerPage])

  const fetchServices = useCallback(
    async (name?: string) => {
      setError(null)
      setIsLoading(true)
      try {
        const url = name
          ? `/serviceTypes?name=${encodeURIComponent(name)}`
          : '/serviceTypes'
        const response = await api.get<ServiceType[]>(url)
        setAllServices(response.data)
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError(`Nenhum serviço encontrado ${name ? `com o título "${name}"` : ''}.`)
          addToast({
            type: 'error',
            title: 'Erro ao Carregar',
            description: `Nenhum serviço foi encontrado ou houve um erro na busca ${name ? `com o título "${name}"` : ''}.`,
          })
        } else {
          setError('Erro ao carregar serviços. Tente novamente.')
          addToast({
            type: 'error',
            title: 'Erro de Conexão',
            description: 'Não foi possível carregar os dados dos serviços.',
          })
        }
        setAllServices([])
      } finally {
        setIsLoading(false)
      }
    },
    [addToast]
  )

  useEffect(() => {
    fetchServices(searchTerm || undefined)
  }, [fetchServices, searchTerm])

  const reloadDataAndResetPage = useCallback(async () => {
    setCurrentPage(1)
    await fetchServices(searchTerm || undefined)
  }, [searchTerm, fetchServices])

  const handleSubmitService = useCallback(
    async (data: ServiceFormData) => {
      setIsLoading(true)

      const serviceId = serviceToEdit?.id

      try {
        const dataToSave = {
          name: data.name,
          description: data.description,
          rank: data.rank,
        }

        if (serviceId) {
          await api.put<ServiceType>(`/serviceTypes/${serviceId}`, dataToSave)
          addToast({
            type: 'success',
            title: 'Serviço Atualizado',
            description: 'Os dados do serviço foram atualizados com sucesso!',
          })
        } else {
          await api.post('/serviceTypes', dataToSave) // Endpoint alterado
          addToast({
            type: 'success',
            title: 'Serviço Cadastrado',
            description: 'Novo serviço cadastrado com sucesso!',
          })
        }

        setIsFormModalOpen(false)
        setServiceToEdit(null)
        setServiceForActions(null)
        await reloadDataAndResetPage()
      } catch (err) {
        addToast({
          type: 'error',
          title: `Erro ao ${serviceId ? 'atualizar' : 'cadastrar'} serviço`,
          description: 'Ocorreu um erro. Tente novamente ou verifique os dados.',
        })
      } finally {
        setIsLoading(false)
      }
    },
    [serviceToEdit, addToast, reloadDataAndResetPage]
  )

  const handleDeleteService = useCallback(
    async (id: string) => {
      setError(null)
      setIsLoading(true)

      try {
        await api.delete(`/serviceTypes/${id}`)
        addToast({
          type: 'success',
          title: 'Serviço Deletado',
          description: 'Serviço removido com sucesso!',
        })
        setServiceForActions(null)
        await reloadDataAndResetPage()
      } catch (err) {
        setError('Erro ao deletar serviço.')
        addToast({
          type: 'error',
          title: 'Erro ao Deletar',
          description: 'Não foi possível deletar o serviço. Tente novamente.',
        })
      } finally {
        setIsLoading(false)
      }
    },
    [addToast, reloadDataAndResetPage]
  )

  const handleOpenCreationModal = useCallback(() => {
    setServiceToEdit(null)
    setServiceForActions(null)
    setIsFormModalOpen(true)
  }, [])

  const handleOpenEditModal = useCallback((service: ServiceType) => {
    setServiceToEdit(service)
    setServiceForActions(null)
    setIsFormModalOpen(true)
  }, [])

  const handleOpenActionsModal = useCallback((service: ServiceType) => {
    setServiceForActions(service)
  }, [])

  const handleCloseFormModal = useCallback(() => {
    setIsFormModalOpen(false)
    setServiceToEdit(null)
  }, [])

  const handleCloseActionsModal = useCallback(() => {
    setServiceForActions(null)
  }, [])

  const initialData = useMemo(() => {
    if (!serviceToEdit) {
      return undefined
    }
    const formattedDate = serviceToEdit.created_at
      ? format(parseISO(serviceToEdit.created_at), 'yyyy-MM-dd')
      : undefined
    return {
      name: serviceToEdit.name,
      description: serviceToEdit.description,
      rank: serviceToEdit.rank,
    } as ServiceFormData
  }, [serviceToEdit])

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

        <h2>Gerenciar Serviços</h2>

        <ServiceSearch searchTerm={searchTerm} onSearch={setSearchTerm} />
        <ButtonContainer>
          <Button onClick={handleOpenCreationModal}>
            <FiPlus />
            Adicionar Serviço
          </Button>
          <Button onClick={() => setViewMode('card')} isActive={viewMode === 'card'}>
            <FiGrid /> Cards
          </Button>
          <Button onClick={() => setViewMode('list')} isActive={viewMode === 'list'}>
            <FiList />
            Lista
          </Button>
        </ButtonContainer>

        {viewMode === 'card' ? (
          <ServiceGrid
            services={displayedServices}
            onIconClick={handleOpenActionsModal}
          />
        ) : (
          <ServiceList
            services={displayedServices}
            onIconClick={handleOpenActionsModal}
          />
        )}

        {allServices.length > 0 && (
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
        title={serviceToEdit ? 'Atualizar Serviço' : 'Cadastrar Novo Serviço'}
      >
        <MilServicesForm onSubmit={handleSubmitService} initialData={initialData} />
      </Modal>

      {serviceForActions && (
        <Modal
          isOpen={!!serviceForActions}
          onClose={handleCloseActionsModal}
          title={`Opções de Ação: ${serviceForActions.name}`}
        >
          {serviceForActions && (
            <div>
              <h3>Detalhes do Serviço:</h3>
              <p>
                Nome: <span>{serviceForActions.name || 'Não informado'}</span>
              </p>
              <p>
                Descrição: <span>{serviceForActions.description || 'Não informado'}</span>
              </p>
              <p>
                Posto/Graduação: <span>{serviceForActions.rank || 'Não informado'}</span>
              </p>
              <p>
                Data de Criação:
                <span>
                  {' '}
                  {serviceForActions.created_at
                    ? format(parseISO(serviceForActions.created_at), 'dd/MM/yyyy')
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
                    handleOpenEditModal(serviceForActions)
                  }}
                >
                  Editar Dados
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Tem certeza que deseja deletar o serviço "${serviceForActions.name}"?`
                      )
                    ) {
                      handleDeleteService(serviceForActions.id)
                    }
                  }}
                >
                  Remover Serviço
                </Button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </Layout>
  )
}
