import type React from 'react'
import { Route, Routes } from 'react-router-dom'

import ProtectedRoute from './ProtectedRoute'

import Forecast from '../pages/Forecast'
import ForgoPassword from '../pages/ForgotPassword'
import MilServices from '../pages/MilServices'
import Militaries from '../pages/Militaries'
import Profile from '../pages/Profile'
import ResetPassword from '../pages/ResetPassword'
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<SignIn />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/forgot-password" element={<ForgoPassword />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route
      path="/militaries"
      element={<ProtectedRoute element={<Militaries />} isPrivate />}
    />
    <Route
      path="/services"
      element={<ProtectedRoute element={<MilServices />} isPrivate />}
    />
    <Route
      path="/forecast"
      element={<ProtectedRoute element={<Forecast />} isPrivate />}
    />
    <Route path="/profile" element={<ProtectedRoute element={<Profile />} isPrivate />} />
  </Routes>
)

export default AppRoutes
