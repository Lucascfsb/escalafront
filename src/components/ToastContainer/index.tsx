import type React from 'react'
import { useTransition } from 'react-spring'

import Toast from './Toast'

import type { ToastMessage } from '../../hooks/toast'
import { Container } from './styles'

interface ToastCointainerProps {
  messages: ToastMessage[]
}

const ToastContainer: React.FC<ToastCointainerProps> = ({ messages }) => {
  const messagesWithTransitions = useTransition(messages, {
    keys: (message: ToastMessage) => message.id,
    from: { right: '-120%', opacity: 0 },
    enter: { right: '0%', opacity: 1 },
    leave: { right: '-120%', opacity: 0 },
  })

  return (
    <Container>
      {messagesWithTransitions((style, item) => (
        <Toast key={item.id} style={style} message={item} />
      ))}
    </Container>
  )
}

export default ToastContainer
