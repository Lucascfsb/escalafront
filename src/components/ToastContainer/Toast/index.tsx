import type React from 'react'

import { FiAlertCircle, FiCheckCircle, FiInfo, FiXCircle } from 'react-icons/fi'

import { useEffect } from 'react'
import { useToast } from '../../../hooks/toast'
import type { ToastMessage } from '../../../hooks/toast'
import { Container } from './styles'

interface ToastProps {
  message: ToastMessage
  style: object
}

const icons = {
  info: <FiInfo size={24} />,
  error: <FiAlertCircle size={24} />,
  success: <FiCheckCircle size={24} />,
}

const Toast: React.FC<ToastProps> = ({ message, style }) => {
  const { removeToast } = useToast()

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(message.id)
    }, 3000)

    return () => {
      clearTimeout(timer)
    }
  }, [message.id, removeToast])

  return (
    <Container type={message.type} $hasDescription={!!message.description} style={style}>
      {icons[message.type || 'info']}

      <div>
        <strong>{message.title}</strong>
        {message.description && <p>{message.description}</p>}
      </div>

      <button onClick={() => removeToast(message.id)} type="button">
        <FiXCircle size={18} />
      </button>
    </Container>
  )
}

export default Toast
