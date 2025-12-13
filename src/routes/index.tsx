import type React from 'react'
import { Route, Routes } from 'react-router-dom'

import { ProtectedRoute } from './ProtectedRoute'

import { ForecastPage } from '../pages/ForecastPage'
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage'
import { MilServicesPage } from '../pages/MilServicesPage'
import { MilitariesPage } from '../pages/MilitariesPage'
import { ProfilePage } from '../pages/ProfilePage'
import { ResetPasswordPage } from '../pages/ResetPasswordPage'
import { ScheduleSuggestionPage } from '../pages/ScheduleSuggestionPage'
import { SignInPage } from '../pages/SignInPage'
import { SignUpPage } from '../pages/SignUpPage'

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<SignInPage />} />
    <Route path="/signup" element={<SignUpPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
    <Route
      path="/militaries"
      element={<ProtectedRoute element={<MilitariesPage />} isPrivate />}
    />
    <Route
      path="/services"
      element={<ProtectedRoute element={<MilServicesPage />} isPrivate />}
    />
    <Route
      path="/forecast"
      element={<ProtectedRoute element={<ForecastPage />} isPrivate />}
    />
    <Route
      path="/profile"
      element={<ProtectedRoute element={<ProfilePage />} isPrivate />}
    />
    <Route
      path="/schedule-suggestion"
      element={<ProtectedRoute element={<ScheduleSuggestionPage />} isPrivate />}
    />
  </Routes>
)

export { AppRoutes }
