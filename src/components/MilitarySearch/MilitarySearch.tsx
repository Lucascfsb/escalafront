import type React from 'react'
import { FiSearch, FiX } from 'react-icons/fi'
import styled from 'styled-components'

import { Button } from '../Button/index'
import { Input } from '../Input/index'

interface MilitarySearchProps {
  searchTerm: string
  onSearch: (term: string) => void
}

const SearchContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
`

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
      />
      {searchTerm && (
        <Button type="button" onClick={handleClear} variant="info">
          <FiX /> Limpar Busca
        </Button>
      )}
    </SearchContainer>
  )
}
