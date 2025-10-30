import type React from 'react'

import { FiZoomOut } from 'react-icons/fi'
import type { ServiceType } from '../../pages/MilServicesPage/types'
import { ServiceDisplay } from '../InfoDisplay/Display/ServiceDisplay'

import { EmptyState, TableContainer  } from './styled'

interface ServiceGridProps {
  services: ServiceType[]
  onIconClick: (service: ServiceType) => void
}

export const ServiceGrid: React.FC<ServiceGridProps> = 
({ 
  services, 
  onIconClick, 
}) => {
  return (
    <TableContainer>
      {services.length > 0 ? (
        services.map(service => (
          <ServiceDisplay
            key={service.id}
            service={service}
            onIconClick={() => onIconClick(service)}
          />
        ))
      ) : (
        <EmptyState>
          <FiZoomOut />
          <p>Não encontramos nenhum Tipo de Serviço com o termo</p>
        </EmptyState>
      )}
    </TableContainer>
  )
}
