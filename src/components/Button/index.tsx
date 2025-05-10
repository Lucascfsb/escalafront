import type React from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { Container } from './styles'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

const Button: React.FC<ButtonProps> = ({ children, ...rest }) => (
  <Container as="button" {...rest}>
    {children}
  </Container>
)

export default Button
