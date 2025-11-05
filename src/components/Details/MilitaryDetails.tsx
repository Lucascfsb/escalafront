import { format, parseISO } from 'date-fns'
import type React from 'react'
import type { Military } from '../../pages/MilitariesPage/types'
import { Button } from '../Button'

interface MilitaryDetailsProps {
  military: Military
  onEdit: () => void
  onDelete: () => void
}

export const MilitaryDetails: React.FC<MilitaryDetailsProps> = ({
  military,
  onEdit,
  onDelete,
}) => {
  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja deletar ${military.name}?`)) {
      onDelete()
    }
  }

  return (
    <div>
      <h3>Detalhes do Militar:</h3>

      <p>
        <strong>Nome:</strong> {military.name || 'Não informado'}
      </p>

      <p>
        <strong>Posto/Graduação:</strong> {military.rank || 'Não informado'}
      </p>

      <p>
        <strong>Qualificação:</strong> {military.qualification || 'Não informado'}
      </p>

      <p>
        <strong>Data de Entrada:</strong>{' '}
        {military.date_of_entry
          ? format(parseISO(military.date_of_entry), 'dd/MM/yyyy')
          : 'Não informada'}
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
        <Button variant="danger" onClick={handleDelete}>
          Remover Militar
        </Button>
      </div>
    </div>
  )
}
