import type React from 'react'

import { FiZoomOut } from 'react-icons/fi'
import type { ServiceType } from '../../../pages/MilServicesPage/types'
import { ServiceDisplay } from '../../InfoDisplay/Display/ServiceDisplay'
import { EmptyState, ListContainer } from './styled'

interface ServiceListProps {
  services: ServiceType[]
  onIconClick: (service: ServiceType) => void
}

export const ServiceList: React.FC<ServiceListProps> = ({
  services,
  onIconClick,
}) => {
  return (
    <ListContainer>
      {services.length > 0 ? (
        services.map(service => (
          <ServiceDisplay
            key={service.id} 
            service={service}
            onIconClick={() => onIconClick(service)}
            viewMode="list" 
          />
        ))
      ) : (
        <EmptyState>
          <FiZoomOut />
          <p>Não encontramos nenhum Tipo de Serviço com o termo</p>
        </EmptyState>
      )}
    </ListContainer>
  )
}