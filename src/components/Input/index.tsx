import { useField } from '@unform/core'
import type React from 'react'
import type { InputHTMLAttributes } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { IconBaseProps } from 'react-icons'
import { FiAlertCircle } from 'react-icons/fi'
import { applyMask, formatDateForDisplay, formatDateForStorage } from '../../utils/mask'

import { Container, ErrorContainer } from './styles'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  $containerStyle?: object
  icon: React.ComponentType<IconBaseProps>
  mask?: string
  maskChar?: string | null
  maskType?: 'date' | 'custom'
}

const Input: React.FC<InputProps> = ({
  icon: Icon,
  name,
  $containerStyle = {},
  mask,
  maskChar = null,
  maskType,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [isFilled, setIsFilled] = useState(false)
  const { fieldName, defaultValue, error, registerField } = useField(name)
  const [displayValue, setDisplayValue] = useState(defaultValue || '')

  const isDateField = maskType === 'date' || mask?.includes('99/99/9999')

  useEffect(() => {
    if (!defaultValue) {
      setDisplayValue('')
      return
    }

    if (isDateField && defaultValue.includes('-')) {
      setDisplayValue(formatDateForDisplay(defaultValue))
    } else {
      setDisplayValue(defaultValue)
    }
  }, [defaultValue, isDateField])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/\D/g, '')
      if (mask) {
        setDisplayValue(applyMask(rawValue, mask))
      } else {
        setDisplayValue(e.target.value)
      }
    },
    [mask]
  )

  const handleInputBlur = useCallback(() => {
    setIsFocused(false)
    setIsFilled(!!inputRef.current?.value)
  }, [])

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputRef.current,
      getValue: (ref: HTMLInputElement) => {
        if (mask && ref.value && mask.includes('99/99/9999')) {
          return formatDateForStorage(ref.value)
        }
        return ref.value
      },
      setValue: (ref: HTMLInputElement, value: string) => {
        if (mask && value && mask.includes('99/99/9999') && value.includes('-')) {
          const parts = value.split('-')
          if (parts.length === 3) {
            const formattedValue = formatDateForDisplay(value)
            ref.value = formattedValue
            setDisplayValue(formattedValue)
            return
          }
        }
        ref.value = value
        setDisplayValue(value)
      },
      clearValue: (ref: HTMLInputElement) => {
        ref.value = ''
        setDisplayValue('')
      },
    })
  }, [fieldName, registerField, mask])

  return (
    <Container
      style={$containerStyle}
      $isErrored={!!error}
      $isFilled={isFilled}
      $isFocused={isFocused}
    >
      {Icon && <Icon size={20} />}
      <input
        onBlur={handleInputBlur}
        onChange={handleChange}
        value={displayValue}
        ref={inputRef}
        {...rest}
      />

      {error && (
        <ErrorContainer title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </ErrorContainer>
      )}
    </Container>
  )
}

export { Input }
