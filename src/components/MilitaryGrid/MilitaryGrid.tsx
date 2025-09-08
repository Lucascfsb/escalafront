import type React from 'react'

import type { Military } from '../../pages/MilitariesPage/types'
import { MilitaryDisplay } from '../InfoDisplay/Display/MilitaryDisplay'
import { Pagination } from '../Pagination/index'

import { TableContainer } from './styled'

interface MilitaryTableProps {
  militaries: Military[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onEdit: (military: Military) => void
  onDelete: (id: string) => Promise<void>
  isLoading: boolean
}

export const MilitaryTable: React.FC<MilitaryTableProps> = ({
  militaries,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  isLoading,
}) => {
  return (
    <TableContainer>
      {militaries.length > 0 ? (
        militaries.map(military => (
          <MilitaryDisplay
            key={military.id}
            military={military}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      ) : (
        <p>Nenhum militar encontrado.</p>
      )}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          isLoading={isLoading}
        />
      )}
    </TableContainer>
  )
}
