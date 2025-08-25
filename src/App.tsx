import type React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import {GlobalStyle} from './styles/global'

import {AppProvider} from './hooks'

import {AppRoutes} from './routes'

const App: React.FC = () => (
  <Router>
    <AppProvider>
      <AppRoutes />
    </AppProvider>

    <GlobalStyle />
  </Router>
)

export {App}
