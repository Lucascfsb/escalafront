import type React from 'react'

import { AuthProvider } from './auth'
import { ToastProvider } from './toast'

const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => (
  <AuthProvider>
    <ToastProvider>{children}</ToastProvider>
  </AuthProvider>
)

export { AppProvider }
