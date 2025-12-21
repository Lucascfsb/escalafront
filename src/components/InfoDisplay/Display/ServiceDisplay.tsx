import { FiZoomIn } from 'react-icons/fi'
import type { Service } from '../../../@types/types'
import { InfoDisplay } from '../index'

interface ServiceDisplayProps {
  service: Service
  onIconClick: () => void
  viewMode?: 'list' | 'card'
}

const ServiceDisplay: React.FC<ServiceDisplayProps> = ({
  service,
  onIconClick,
  viewMode,
}) => (
  <InfoDisplay<Service>
    item={service}
    itemType="serviceType"
    onIconClick={onIconClick}
    viewMode={viewMode}
    icon={FiZoomIn}
    fields={[
      { label: 'Nome', value: service.name },
      { label: 'Descrição', value: service.description },
      { label: 'Graduação', value: service.rank },
    ]}
  />
)

export { ServiceDisplay }
