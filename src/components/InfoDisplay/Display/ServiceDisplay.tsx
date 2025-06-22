import type { Service } from '../../../@types/types'
import { InfoDisplay } from '../index'

interface ServiceDisplayProps {
  service: Service
  onEdit: (service: Service) => void
  onDelete: (id: string) => void
}

const ServiceDisplay: React.FC<ServiceDisplayProps> = ({ service, onEdit, onDelete }) => (
  <InfoDisplay<Service>
    item={service}
    onEdit={onEdit}
    onDelete={onDelete}
    itemType="serviceType"
    fields={[
      { label: 'Nome', value: service.name },
      { label: 'Descrição', value: service.description },
      {
        label: 'Criado em',
        value: new Date(service.created_at).toLocaleDateString(),
      },
    ]}
  />
)

export default ServiceDisplay
