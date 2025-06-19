import type React from 'react'
import type { HTMLAttributes } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Container } from './styles'

interface NavItem {
  path: string
  label: string
}

interface SidebarProps extends HTMLAttributes<HTMLElement> {
  navItems: NavItem[]
}

const Sidebar: React.FC<SidebarProps> = ({ navItems, className }) => {
  const location = useLocation()

  const isActive = (path: string): boolean => {
    return location.pathname === path
  }

  return (
    <Container className={className}>
      <nav>
        <ul>
          {navItems.map(item => (
            <li key={item.path} className={isActive(item.path) ? 'active' : ''}>
              <Link to={item.path}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </Container>
  )
}

export default Sidebar
