import { FiZoomIn } from 'react-icons/fi'
import type { Military } from '../../../@types/types'
import { InfoDisplay } from '../index'

interface MilitaryDisplayProps {
  military: Military
  onIconClick: () => void
  viewMode?: 'list' | 'card'
}

const MilitaryDisplay: React.FC<MilitaryDisplayProps> = ({
  military,
  onIconClick,
  viewMode,
}) => (
  <InfoDisplay<Military>
    item={military}
    itemType="military"
    icon={FiZoomIn}
    onIconClick={onIconClick}
    viewMode={viewMode}
    fields={[
      { label: 'Nome', value: military.name },
      { label: 'Posto/Grad', value: military.rank },
      { label: 'Qualificação', value: military.qualification },
      {
        label: 'Data de Entrada',
        value: new Date(military.date_of_entry).toLocaleDateString(),
      },
      {
        label: 'Tipos de Serviço',
        value:
          military.eligibleServiceTypes && military.eligibleServiceTypes.length > 0
            ? military.eligibleServiceTypes.map(st => st.name).join(', ')
            : 'Nenhum serviço',
      },
    ]}
  />
)

export { MilitaryDisplay }
