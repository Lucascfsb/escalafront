import { shade } from 'polished'
import styled from 'styled-components'

interface ButtonProps {
  variant?: 'primary' | 'danger' | 'info'
}

export const Container = styled.button<ButtonProps>`
background: ${props => {
  switch (props.variant) {
    case 'danger':
      return '#c53030' // Cor vermelha para deletar/cancelar
    case 'info':
      return '#808000' // Nova cor azul para "Listar Todos" (exemplo, você pode mudar)
    default:
      return '#f0c14b' // Cor padrão (amarelo) para "primary"
  }
}};
  color: ${props => {
    switch (props.variant) {
      case 'danger':
        return '#fff' // Explicitamente branco para 'danger'
      case 'info':
        return '#fff' // Explicitamente branco para 'info'
      default:
        return '#312e38' // Cor escura para 'primary'
    }
  }};
  
  height: 56px;
  border-radius: 10px;
  border: 0;
  padding: 0 16px;
  width: 100%;
  font-weight: 500;
  margin-top: 16px;
  transition: background-color 0.2s;

  &:hover {
    background: ${props => {
      switch (props.variant) {
        case 'danger':
          return shade(0.2, '#c53030')
        case 'info':
          return shade(0.2, '#808000')
        default:
          return shade(0.2, '#f0c14b')
      }
    }};
  }

    &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`
