import type React from 'react'
import {Button} from '../Button'
import { Container } from './styles'

interface BaseItem {
  id: string
  name: string
  created_at: string
  update_at: string
}

interface InfoDisplayProps<T extends BaseItem> {
  item: T
  onEdit: (item: T) => void
  onDelete: (id: string) => void
  fields: Array<{
    label: string
    value: string | React.ReactNode
  }>
  itemType?: string
}

export function InfoDisplay<T extends BaseItem>({
  item,
  onEdit,
  onDelete,
  fields,
  itemType = 'item',
}: InfoDisplayProps<T>) {
  return (
    <Container data-type={itemType}>
      <div className="info-details">
        <h3>Detalhes:</h3>

        {fields.map(field => (
          <p key={field.label}>
            <strong>{field.label}:</strong> {field.value}
          </p>
        ))}
      </div>

      <div className="button-group">
        <Button onClick={() => onEdit(item)}>Editar</Button>
        <Button onClick={() => onDelete(item.id)}>Deletar</Button>
      </div>
    </Container>
  )
}
