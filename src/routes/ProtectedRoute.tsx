import type React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '../hooks/auth'

interface ProtectedRouteProps {
  element: React.ReactElement
  isPrivate?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isPrivate = false,
  element,
}) => {
  const { user } = useAuth()
  const location = useLocation()

  if (isPrivate && !user) {
    return <Navigate to="/" state={{ from: location }} />
  }

  if (!isPrivate && user) {
    return <Navigate to="/dashboard" state={{ from: location }} />
  }

  return element
}

export default ProtectedRoute
