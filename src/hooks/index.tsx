import type React from 'react'

import { AuthProvider } from './AuthContext'
import { ToastProvider } from './ToastContext'

const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => (
  <AuthProvider>
    <ToastProvider>{children}</ToastProvider>
  </AuthProvider>
)

export default AppProvider
