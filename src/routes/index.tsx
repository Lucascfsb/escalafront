import type React from 'react'
import { Route, Routes } from 'react-router-dom'

import ProtectedRoute from './ProtectedRoute'

import Dashboard from '../pages/Dashboard'
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<SignIn />} />
    <Route path="/signup" element={<SignUp />} />
    <Route
      path="/dashboard"
      element={<ProtectedRoute element={<Dashboard />} isPrivate />}
    />
  </Routes>
)

export default AppRoutes
