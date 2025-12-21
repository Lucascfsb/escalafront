import type React from 'react'
import { Container } from './styles'

interface BaseItem {
  id: string
  name: string
  created_at: string
  updated_at: string
}

interface InfoDisplayProps<T extends BaseItem> {
  item: T
  fields: Array<{
    label: string
    value: string | React.ReactNode
  }>
  itemType?: string
  icon?: React.ComponentType
  onIconClick?: () => void
  viewMode?: 'list' | 'card'
}

export function InfoDisplay<Type extends BaseItem>({
  item,
  fields,
  itemType = 'item',
  icon: Icon,
  onIconClick,
  viewMode,
}: InfoDisplayProps<Type>) {
  return (
    <Container data-type={itemType} viewMode={viewMode}>
      <div className="info-details">
        <h3>Detalhes:</h3>

        {fields.map(field => (
          <p key={field.label}>
            <span>{field.label}:</span>
            <strong className="field-value">{field.value}</strong>
          </p>
        ))}
      </div>
      {Icon && onIconClick && (
        <button onClick={onIconClick} className="info-icon-button" type="button">
          <Icon />
        </button>
      )}
    </Container>
  )
}
