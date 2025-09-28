import type React from 'react'
import { Backdrop, Body, Content, Header } from './styles'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    <Backdrop>
      <Content>
        <Header>
          <h2>{title}</h2>
          <button onClick={onClose} type="button">
            &times;
          </button>
        </Header>
        <Body>{children}</Body>
      </Content>
    </Backdrop>
  )
}
