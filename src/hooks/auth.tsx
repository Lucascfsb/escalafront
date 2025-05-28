import type React from 'react'
import { createContext, useCallback, useContext, useState } from 'react'
import api from '../services/apiClient'

interface AuthState {
  token: string
  user: object
}

interface SignInCredentials {
  email: string
  password: string
  role: string
}

interface AuthContextData {
  user: object
  signIn(credentials: SignInCredentials): Promise<void>
  signOut(): void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@Escala:token')
    const user = localStorage.getItem('@Escala:user')

    if (token && user) {
      return { token, user: JSON.parse(user) }
    }

    return {} as AuthState
  })

  const signIn = useCallback(async ({ email, password, role }: SignInCredentials) => {
    const response = await api.post('sessions', {
      email,
      password,
      role,
    })

    const { token, userWithoutPassword } = response.data

    localStorage.setItem('@Escala:token', token)
    localStorage.setItem('@Escala:user', JSON.stringify(userWithoutPassword))

    setData({ token, user: userWithoutPassword })
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem('@Escala:token')
    localStorage.removeItem('@Escala:user')

    setData({} as AuthState)
  }, [])

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
