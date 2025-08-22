import type React from 'react'
import { createContext, useCallback, useContext, useState } from 'react'
import type { User } from '../@types/types'
import api from '../services/apiClient'

interface AuthState {
  token: string
  user: User
}

interface SignInCredentials {
  email: string
  password: string
  role: string
}

interface AuthContextData {
  user: User
  signIn(credentials: SignInCredentials): Promise<void>
  signOut(): void
  updateUser(user: User): void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@Escala:token')
    const user = localStorage.getItem('@Escala:user')

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`

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

    const { token, user } = response.data

    localStorage.setItem('@Escala:token', token)
    localStorage.setItem('@Escala:user', JSON.stringify(user))

    api.defaults.headers.authorization = `Bearer ${token}`

    setData({ token, user: user })
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem('@Escala:token')
    localStorage.removeItem('@Escala:user')

    setData({} as AuthState)
  }, [])

  const updateUser = useCallback(
    (user: User) => {
      localStorage.setItem('@Escala:user', JSON.stringify(user))

      setData({
        token: data.token,
        user,
      })
    },
    [data.token]
  )

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut, updateUser }}>
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
