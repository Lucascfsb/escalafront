import type React from 'react'

import type { Military } from '../../pages/MilitariesPage/types'
import { MilitaryDisplay } from '../InfoDisplay/Display/MilitaryDisplay'
import { Pagination } from '../Pagination/index'

import { TableContainer } from './styled'

interface MilitaryTableProps {
  militaries: Military[]
  onIconClick: (military: Military) => void
}

export const MilitaryTable: React.FC<MilitaryTableProps> = ({
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
        <p>Nenhum militar encontrado.</p>
      )}
    </TableContainer>
  )
}
