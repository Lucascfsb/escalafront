import { useField } from '@unform/core'
import type React from 'react'
import type { InputHTMLAttributes } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { IconBaseProps } from 'react-icons'
import { FiAlertCircle } from 'react-icons/fi'

import { Container, ErrorContainer } from './styles'

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  name: string
  icon: React.ComponentType<IconBaseProps>
  options: {
    value: string
    label: string
  }[]
}

const Select: React.FC<SelectProps> = ({ name, icon: Icon, options, ...rest }) => {
  const inputRef = useRef<HTMLSelectElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [isFilled, setIsFilled] = useState(false)
  const { fieldName, defaultValue, error, registerField } = useField(name)

  const handleInputFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  const handleInputBlur = useCallback(() => {
    setIsFocused(false)

    setIsFilled(!!inputRef.current?.value)
  }, [])

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    })
  }, [fieldName, registerField])

  return (
    <Container $isErrored={!!error} $isFilled={isFilled} $isFocused={isFocused}>
      {Icon && <Icon size={20} />}
      <select
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        defaultValue={defaultValue}
        ref={inputRef}
        {...rest}
      >
        <option value="" disabled>
          Selecione uma opção
        </option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <ErrorContainer title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </ErrorContainer>
      )}
    </Container>
  )
}

export default Select
