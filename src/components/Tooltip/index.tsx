import type React from 'react'

import { Container } from './styles'

interface ToolTipProps {
  title: string
  className?: string
  children?: React.ReactNode
}

const Tooltip: React.FC<ToolTipProps> = ({ title, children = '', className }) => {
  return (
    <Container className={className}>
      {children}
      <span>{title}</span>
    </Container>
  )
}

export { Tooltip }
