import type React from 'react'
import {Button} from '../Button'
import { PaginationContainer } from './styles'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  isLoading: boolean
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}) => {
  if (totalPages <= 1) return null

  return (
    <PaginationContainer>
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
      >
        Anterior
      </Button>
      <span>
        Página {currentPage} de {totalPages}
      </span>
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
      >
        Próxima
      </Button>
    </PaginationContainer>
  )
}

export { Pagination }
