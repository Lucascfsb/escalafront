import { format, parseISO } from 'date-fns'
import type React from 'react'
import type { ServiceType } from '../../pages/MilServicesPage/types'
import { Button } from '../Button/index'

interface ServiceDetailsProps {
  service: ServiceType
  onEdit: () => void
  onDelete: () => void
}

export const ServiceDetails: React.FC<ServiceDetailsProps> = ({
  service,
  onEdit,
  onDelete,
}) => {
  const handleDeleteClick = () => {
    if (window.confirm(`Tem certeza que deseja deletar o serviço "${service.name}"?`)) {
      onDelete()
    }
  }

  return (
    <div>
      <h3>Detalhes do Serviço:</h3>
      <p>
        Nome: <span>{service.name || 'Não informado'}</span>
      </p>
      <p>
        Descrição: <span>{service.description || 'Não informado'}</span>
      </p>
      <p>
        Posto/Graduação: <span>{service.rank || 'Não informado'}</span>
      </p>
      <p>
        Data de Criação:
        <span>
          {' '}
          {service.created_at
            ? format(parseISO(service.created_at), 'dd/MM/yyyy')
            : 'Não informada'}
        </span>
      </p>
      <div
        style={{
          marginTop: '15px',
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
        }}
      >
        <Button onClick={onEdit}>Editar Dados</Button>
        <Button variant="danger" onClick={handleDeleteClick}>
          Remover Serviço
        </Button>
      </div>
    </div>
  )
}
