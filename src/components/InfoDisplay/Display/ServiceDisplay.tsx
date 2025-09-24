import { FiPlus } from 'react-icons/fi'
import type { Service } from '../../../@types/types'
import { InfoDisplay } from '../index'

interface ServiceDisplayProps {
  service: Service
}

const ServiceDisplay: React.FC<ServiceDisplayProps> = ({ service }) => (
  <InfoDisplay<Service>
    item={service}
    itemType="serviceType"
    icon={FiPlus}
    fields={[
      { label: 'Nome', value: service.name },
      { label: 'Descrição', value: service.description },
      { label: 'Graduação', value: service.rank },
      {
        label: 'Criado em',
        value: new Date(service.created_at).toLocaleDateString(),
      },
    ]}
  />
)

export { ServiceDisplay }
