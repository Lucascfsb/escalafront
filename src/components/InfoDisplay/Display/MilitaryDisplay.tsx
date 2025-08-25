import type { Military } from '../../../@types/types'
import { InfoDisplay } from '../index'

interface MilitaryDisplayProps {
  military: Military
  onEdit: (military: Military) => void
  onDelete: (id: string) => void
}

const MilitaryDisplay: React.FC<MilitaryDisplayProps> = ({
  military,
  onEdit,
  onDelete,
}) => (
  <InfoDisplay<Military>
    item={military}
    onEdit={onEdit}
    onDelete={onDelete}
    itemType="military"
    fields={[
      { label: 'Nome', value: military.name },
      { label: 'Patente', value: military.rank },
      { label: 'Qualificação', value: military.qualification },
      {
        label: 'Data de Entrada',
        value: new Date(military.date_of_entry).toLocaleDateString(),
      },
    ]}
  />
)

export { MilitaryDisplay }
