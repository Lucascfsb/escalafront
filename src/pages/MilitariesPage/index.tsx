import { format, parseISO } from 'date-fns'
import type React from 'react'
import { useMemo, useState } from 'react'
import { FiGrid, FiList, FiPlus } from 'react-icons/fi'

import { useMilitaries } from '../../hooks/useMilitaries'

import { Button } from '../../components/Button'
import { MilitaryDetails } from '../../components/Details/MilitaryDetails'
import { MilitaryForm } from '../../components/Forms/MilitaryForm'
import { MilitaryGrid } from '../../components/Grid/MilitaryGrid'
import { Layout } from '../../components/Layout'
import { MilitaryList } from '../../components/List/MilitaryList/MilitaryList'
import { Modal } from '../../components/Modal'
import { Pagination } from '../../components/Pagination'
import { MilitarySearch } from '../../components/Search/Search'

import { ButtonContainer, MainContent } from './styles'
import type { Military, MilitaryFormData, ViewMode } from './types'

export const MilitariesPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('card')
  const [searchTerm, setSearchTerm] = useState('')

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [militaryToEdit, setMilitaryToEdit] = useState<Military | null>(null)
  const [militaryForActions, setMilitaryForActions] = useState<Military | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)

  const { militaries, isLoading, error, createMilitary, updateMilitary, deleteMilitary } =
    useMilitaries(searchTerm)

  const itemsPerPageOptions = [12, 24, 40]

  const totalPages = useMemo(() => {
    return Math.ceil(militaries.length / itemsPerPage)
  }, [militaries.length, itemsPerPage])

  const displayedMilitaries = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return militaries.slice(startIndex, startIndex + itemsPerPage)
  }, [militaries, currentPage, itemsPerPage])

  const initialFormData = useMemo(() => {
    if (!militaryToEdit) return undefined

    return {
      ...militaryToEdit,
      date_of_entry: format(parseISO(militaryToEdit.date_of_entry), 'yyyy-MM-dd'),
    } as MilitaryFormData
  }, [militaryToEdit])

  const handleSubmitMilitary = async (data: MilitaryFormData) => {
    if (militaryToEdit) {
      await updateMilitary(militaryToEdit.id, data)
    } else {
      await createMilitary(data)
    }
    setIsFormModalOpen(false)
    setMilitaryToEdit(null)
    setCurrentPage(1)
  }

  const handleDeleteMilitary = async () => {
    if (!militaryForActions) return

    await deleteMilitary(militaryForActions.id)
    setMilitaryForActions(null)
    setCurrentPage(1)
  }

  const handleOpenCreationModal = () => {
    setMilitaryToEdit(null)
    setIsFormModalOpen(true)
  }

  const handleOpenEditModal = (military: Military) => {
    setMilitaryToEdit(military)
    setMilitaryForActions(null)
    setIsFormModalOpen(true)
  }

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (value: string) => {
    setCurrentPage(1)
    setItemsPerPage(Number(value))
  }

  return (
    <Layout>
      <MainContent>
        {error && <p>{error}</p>}

        <h2>
          Gerenciar Militares
          <ButtonContainer>
            <Button onClick={handleOpenCreationModal}>
              <FiPlus /> Adicionar Militar
            </Button>
            <Button onClick={() => setViewMode('card')} isActive={viewMode === 'card'}>
              <FiGrid /> Cards
            </Button>
            <Button onClick={() => setViewMode('list')} isActive={viewMode === 'list'}>
              <FiList /> Lista
            </Button>
          </ButtonContainer>
        </h2>

        <MilitarySearch searchTerm={searchTerm} onSearch={setSearchTerm} />

        {viewMode === 'card' ? (
          <MilitaryGrid
            militaries={displayedMilitaries}
            onIconClick={setMilitaryForActions}
          />
        ) : (
          <MilitaryList
            militaries={displayedMilitaries}
            onIconClick={setMilitaryForActions}
          />
        )}

        {militaries.length > 0 && (
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
          setMilitaryToEdit(null)
        }}
        title={militaryToEdit ? 'Atualizar Militar' : 'Cadastrar Novo Militar'}
      >
        <MilitaryForm onSubmit={handleSubmitMilitary} initialData={initialFormData} />
      </Modal>

      {militaryForActions && (
        <Modal
          isOpen={!!militaryForActions}
          onClose={() => setMilitaryForActions(null)}
          title={`Opções de Ação: ${militaryForActions.name}`}
        >
          <MilitaryDetails
            military={militaryForActions}
            onEdit={() => handleOpenEditModal(militaryForActions)}
            onDelete={handleDeleteMilitary}
          />
        </Modal>
      )}
    </Layout>
  )
}
