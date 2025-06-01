import type React from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { Container } from './styles'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
}

const Button: React.FC<ButtonProps> = ({ children, loading, ...rest }) => (
  <Container as="button" {...rest}>
    {loading ? 'Carregando...' : children}
  </Container>
)

export default Button
