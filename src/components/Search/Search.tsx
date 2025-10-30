import type React from 'react'
import { FiSearch, FiX } from 'react-icons/fi'

import { Input } from '../Input/index'
import { SearchContainer } from './styled'

interface MilitarySearchProps {
  searchTerm: string
  onSearch: (term: string) => void
}

interface ServiceSearchProps {
  searchTerm: string
  onSearch: (term: string) => void
}

export const MilitarySearch: React.FC<MilitarySearchProps> = ({
  searchTerm,
  onSearch,
}) => {
  const handleClear = () => {
    onSearch('')
  }

  return (
    <SearchContainer>
      <Input
        name="searchName"
        icon={FiSearch}
        type="text"
        placeholder="Buscar por nome de guerra..."
        value={searchTerm}
        onChange={e => onSearch(e.target.value)}
        rightIcon={searchTerm ? FiX : undefined}
        onRightIconClick={searchTerm ? handleClear : undefined}
      />
    </SearchContainer>
  )
}

export const ServiceSearch: React.FC<ServiceSearchProps> = ({
  searchTerm,
  onSearch,
}) => {
  const handleClear = () => {
    onSearch('')
  }

  return (
    <SearchContainer>
      <Input
        name="searchService" 
        icon={FiSearch}
        type="text"
        placeholder="Buscar por título ou descrição do serviço..."
        value={searchTerm}
        onChange={e => onSearch(e.target.value)}
        rightIcon={searchTerm ? FiX : undefined}
        onRightIconClick={searchTerm ? handleClear : undefined}
      />
    </SearchContainer>
  )
}
