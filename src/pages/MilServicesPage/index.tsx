import type React from 'react'
import { useCallback, useMemo, useState } from 'react'
import { FiGrid, FiList, FiPlus } from 'react-icons/fi'

import { useServices } from '../../hooks/useServices'

import { Button } from '../../components/Button'
import { MilServicesForm } from '../../components/Forms/MilServiceForm'
import { ServiceGrid } from '../../components/Grid/ServiceGrid'
import { Layout } from '../../components/Layout'
import { ServiceList } from '../../components/List/MilServiceList/ServiceList'
import { Modal } from '../../components/Modal'
import { Pagination } from '../../components/Pagination'
import { ServiceSearch } from '../../components/Search/Search'

import { ServiceDetails } from '../../components/Details/ServiceDetails'
import { ButtonContainer, MainContent } from './styles'
import type { ServiceFormData, ServiceType, ViewMode } from './types'

export const MilServicesPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('card')
  const [searchTerm, setSearchTerm] = useState('')

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [serviceToEdit, setServiceToEdit] = useState<ServiceType | null>(null)
  const [serviceForActions, setServiceForActions] = useState<ServiceType | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)

  const { services, isLoading, error, createService, updateService, deleteService } =
    useServices(searchTerm)

  const itemsPerPageOptions = [12, 24, 40]

  const totalPages = useMemo(() => {
    return Math.ceil(services.length / itemsPerPage)
  }, [services.length, itemsPerPage])

  const displayedServices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return services.slice(startIndex, startIndex + itemsPerPage)
  }, [services, currentPage, itemsPerPage])

  const initialFormData = useMemo(() => {
    if (!serviceToEdit) return undefined

    return {
      name: serviceToEdit.name,
      description: serviceToEdit.description,
      rank: serviceToEdit.rank,
    } as ServiceFormData
  }, [serviceToEdit])

  const handleSubmitService = useCallback(
    async (data: ServiceFormData) => {
      try {
        if (serviceToEdit) {
          await updateService(serviceToEdit.id, data)
        } else {
          await createService(data)
        }
        setIsFormModalOpen(false)
        setServiceToEdit(null)
        setCurrentPage(1)
      } catch (err) {
        // Erro já tratado no hook useServices
      }
    },
    [serviceToEdit, createService, updateService]
  )

  const handleDeleteService = useCallback(async () => {
    if (!serviceForActions) return

    try {
      await deleteService(serviceForActions.id)
      setServiceForActions(null)
      setCurrentPage(1)
    } catch (err) {
      // Erro já tratado no hook useServices
    }
  }, [serviceForActions, deleteService])

  const handleOpenCreationModal = useCallback(() => {
    setServiceToEdit(null)
    setIsFormModalOpen(true)
  }, [])

  const handleOpenEditModal = useCallback((service: ServiceType) => {
    setServiceToEdit(service)
    setServiceForActions(null)
    setIsFormModalOpen(true)
  }, [])

  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) return
      setCurrentPage(page)
    },
    [totalPages]
  )

  const handleItemsPerPageChange = useCallback((value: string) => {
    setCurrentPage(1)
    setItemsPerPage(Number(value))
  }, [])

  return (
    <Layout>
      <MainContent>
        {error && <p style={{ color: '#c53030' }}>{error}</p>}

        <h2>
          Gerenciar Serviços
          <ButtonContainer>
            <Button onClick={handleOpenCreationModal}>
              <FiPlus /> Adicionar Serviço
            </Button>
            <Button onClick={() => setViewMode('card')} isActive={viewMode === 'card'}>
              <FiGrid /> Cards
            </Button>
            <Button onClick={() => setViewMode('list')} isActive={viewMode === 'list'}>
              <FiList /> Lista
            </Button>
          </ButtonContainer>
        </h2>

        <ServiceSearch searchTerm={searchTerm} onSearch={setSearchTerm} />

        {viewMode === 'card' ? (
          <ServiceGrid services={displayedServices} onIconClick={setServiceForActions} />
        ) : (
          <ServiceList services={displayedServices} onIconClick={setServiceForActions} />
        )}

        {services.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isLoading={isLoading}
            itemsPerPage={itemsPerPage}
            itemsPerPageOptions={itemsPerPageOptions}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}
      </MainContent>

      <Modal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false)
          setServiceToEdit(null)
        }}
        title={serviceToEdit ? 'Atualizar Serviço' : 'Cadastrar Novo Serviço'}
      >
        <MilServicesForm onSubmit={handleSubmitService} initialData={initialFormData} />
      </Modal>

      {serviceForActions && (
        <Modal
          isOpen={!!serviceForActions}
          onClose={() => setServiceForActions(null)}
          title={`Opções de Ação: ${serviceForActions.name}`}
        >
          <ServiceDetails
            service={serviceForActions}
            onEdit={() => {
              setServiceForActions(null)
              handleOpenEditModal(serviceForActions)
            }}
            onDelete={handleDeleteService}
          />
        </Modal>
      )}
    </Layout>
  )
}
