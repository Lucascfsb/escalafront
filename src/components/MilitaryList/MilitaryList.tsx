import type React from 'react'

import { FiZoomOut } from 'react-icons/fi'
import type { Military } from '../../pages/MilitariesPage/types'
import { MilitaryDisplay } from '../InfoDisplay/Display/MilitaryDisplay'

import { EmptyState, ListContainer } from './styled'

interface MilitaryTableProps {
  militaries: Military[]
  onIconClick: (military: Military) => void
}

export const MilitaryList: React.FC<MilitaryTableProps> = ({
  militaries,
  onIconClick,
}) => {
  return (
    <ListContainer>
      {militaries.length > 0 ? (
        militaries.map(military => (
          <MilitaryDisplay
            key={military.id}
            military={military}
            onIconClick={() => onIconClick(military)}
            viewMode="list"
          />
        ))
      ) : (
        <EmptyState>
          <FiZoomOut />
          <p>Não encontramos nenhum militar com o termo</p>
        </EmptyState>
      )}
    </ListContainer>
  )
}
