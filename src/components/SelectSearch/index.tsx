import type React from 'react'
import Select, { type SingleValue } from 'react-select'
import { SelectStyles } from './styles'
import type { IconBaseProps } from 'react-icons'


interface OptionType {
  value: string
  label: string
}

interface SearchableSelectProps {
  options: OptionType[]
  icon: React.ComponentType<IconBaseProps>
  value: string | null
  onChange: (value: string | null) => void
  placeholder?: string
  isDisabled?: boolean
}

const SelectSearch: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = '(Nenhum)',
  isDisabled,
}) => {
  const selectedOption: OptionType | null =
    options.find(option => option.value === value) ?? null

  return (
    <SelectStyles>
      <Select<OptionType, false>
        options={options}
        value={selectedOption}
        onChange={(option: SingleValue<OptionType>) => onChange(option?.value ?? null)}
        placeholder={placeholder}
        isDisabled={isDisabled}
        isClearable
        isSearchable
        classNamePrefix="custom-select"
      />
    </SelectStyles>
  )
}

export { SelectSearch }
