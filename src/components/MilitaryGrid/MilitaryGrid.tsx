import type React from 'react'

import { FiZoomOut } from 'react-icons/fi'
import type { Military } from '../../pages/MilitariesPage/types'
import { MilitaryDisplay } from '../InfoDisplay/Display/MilitaryDisplay'

import { EmptyState, TableContainer } from './styled'

interface MilitaryTableProps {
  militaries: Military[]
  onIconClick: (military: Military) => void
}

export const MilitaryGrid: React.FC<MilitaryTableProps> = ({
  militaries,
  onIconClick,
}) => {
  return (
    <TableContainer>
      {militaries.length > 0 ? (
        militaries.map(military => (
          <MilitaryDisplay
            key={military.id}
            military={military}
            onIconClick={() => onIconClick(military)}
          />
        ))
      ) : (
        <EmptyState>
          <FiZoomOut />
          <p>Não encontramos nenhum militar com o termo</p>
        </EmptyState>
      )}
    </TableContainer>
  )
}
