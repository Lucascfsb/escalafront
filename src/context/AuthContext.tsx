import type React from 'react'
import { createContext, useCallback } from 'react'
import api from '../services/apiClient'

interface SignInCredentials {
  email: string
  password: string
  role: string
}

interface AuthContextDate {
  name: string
  signIn(credentials: SignInCredentials): Promise<void>
}

export const AuthContext = createContext<AuthContextDate>({} as AuthContextDate)

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const signIn = useCallback(async ({ email, password, role }: SignInCredentials) => {
    const response = await api.post('sessions', {
      email,
      password,
      role,
    })

    console.log(response.data)
  }, [])

  return <AuthContext.Provider value={{ name: 'diego', signIn }}>{children}</AuthContext.Provider>
}
