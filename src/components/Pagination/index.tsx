import type React from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Button } from '../Button'
import { SelectSearch } from '../SelectSearch'
import { PaginationContainer } from './styles'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  isLoading: boolean
  itemsPerPage?: number
  itemsPerPageOptions?: number[]
  onItemsPerPageChange?: (value: string) => void
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
  itemsPerPage,
  itemsPerPageOptions,
  onItemsPerPageChange,
}) => {
  if (totalPages === 0) return null

  const selectOptions = (itemsPerPageOptions ?? []).map(option => ({
    value: String(option),
    label: `${option}`,
  }))

  const handleItemsPerPageChange = (option: { value: string; label: string } | null) => {
    if (onItemsPerPageChange && option) {
      onItemsPerPageChange(option.value)
    }
  }

  return (
    <PaginationContainer>
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
      >
        <FiChevronLeft />
      </Button>
      <span>
        Página {currentPage} de {totalPages}
      </span>
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
      >
        <FiChevronRight />
      </Button>
      <SelectSearch
        value={
          selectOptions.find(option => option.value === String(itemsPerPage)) ?? null
        }
        onChange={handleItemsPerPageChange}
        options={selectOptions}
        isDisabled={isLoading}
        placeholder=""
        isSelectClearable={false}
        isSelectSearchable={false}
      />
    </PaginationContainer>
  )
}

export { Pagination }
