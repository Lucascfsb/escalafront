import type React from 'react'
import Button from '../Button'
import { Container } from './styles'

interface Military {
  id: string
  name: string
  rank: string
  qualification: string
  date_of_entry: string
  created_at: string
  update_at: string
}

interface MilitaryDetailsCardProps {
  military: Military
  onEdit: (military: Military) => void
  onDelete: (id: string) => void
}

const MilitaryDisplay: React.FC<MilitaryDetailsCardProps> = ({
  military,
  onEdit,
  onDelete,
}) => {
  return (
    <Container>
      <div className="military-info-details">
        <h3>Detalhes do Militar Encontrado:</h3>
        <p>
          <strong>Nome:</strong> {military.name}
        </p>
        <p>
          <strong>Patente:</strong> {military.rank}
        </p>
        <p>
          <strong>Qualificação:</strong> {military.qualification}
        </p>
        <p>
          <strong>Data de Entrada: </strong>
          {new Date(military.date_of_entry).toLocaleDateString()}
        </p>
      </div>

      <div className="button-group">
        <Button onClick={() => onEdit(military)}>Editar</Button>
        <Button onClick={() => onDelete(military.id)}>Delete</Button>
      </div>
    </Container>
  )
}

export default MilitaryDisplay
