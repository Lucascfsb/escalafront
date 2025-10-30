import type React from 'react'
import type { IconBaseProps } from 'react-icons'
import { FiAlertCircle } from 'react-icons/fi'
import Select, { type SingleValue } from 'react-select'
import { ErrorContainer } from '../Input/styles'
import { IconContainer, SelectContainer, SelectStyles } from './styles'

interface OptionType {
  value: string
  label: string
}

interface SearchableSelectProps {
  options?: OptionType[]
  icon?: React.ComponentType<IconBaseProps>
  value: OptionType | null
  onChange: (value: SingleValue<OptionType>) => void
  placeholder?: string
  isDisabled?: boolean
  error?: string
  isSelectClearable?: boolean
  isSelectSearchable?: boolean
}

const SelectSearch: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = '(Select an option)',
  isDisabled,
  icon: Icon,
  error,
  isSelectClearable = true,
  isSelectSearchable = true,
}) => {
  return (
    <SelectContainer $isErrored={!!error}>
      {Icon && (
        <IconContainer>
          <Icon size={20} />
        </IconContainer>
      )}
      <SelectStyles>
        <Select<OptionType, false>
          options={options}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          isDisabled={isDisabled}
          isClearable={isSelectClearable}
          classNamePrefix="custom-select"
          isSearchable={isSelectSearchable}
        />
      </SelectStyles>
      {error && (
        <ErrorContainer title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </ErrorContainer>
      )}
    </SelectContainer>
  )
}

export { SelectSearch }
