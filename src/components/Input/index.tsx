import type React from 'react'
import type { InputHTMLAttributes } from 'react'
import { forwardRef, useCallback, useState } from 'react'
import type { IconBaseProps } from 'react-icons'
import { FiAlertCircle } from 'react-icons/fi'

import { Container, ErrorContainer, RightIconContainer } from './styles'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  $containerStyle?: object
  icon?: React.ComponentType<IconBaseProps>
  error?: string
  rightIcon?: React.ComponentType<IconBaseProps>

  onRightIconClick?: () => void
}

const InputBase: React.ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  {
    icon: Icon,
    name,
    $containerStyle = {},
    error,
    onFocus,
    onBlur,
    rightIcon: RightIcon,
    onRightIconClick,
    ...rest
  },
  ref
) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isFilled, setIsFilled] = useState(false)

  const handleInputFocus = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      onFocus?.(event)
    },
    [onFocus]
  )

  const handleInputBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      setIsFilled(!!event.target.value)
      onBlur?.(event)
    },
    [onBlur]
  )

  return (
    <Container
      style={$containerStyle}
      $isErrored={!!error}
      $isFilled={isFilled}
      $isFocused={isFocused}
    >
      {Icon && <Icon size={20} />}
      <input onFocus={handleInputFocus} onBlur={handleInputBlur} ref={ref} {...rest} />

      {error && (
        <ErrorContainer title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </ErrorContainer>
      )}
      {RightIcon && onRightIconClick && (
        <RightIconContainer onClick={onRightIconClick}>
          <RightIcon size={20} />
        </RightIconContainer>
      )}
    </Container>
  )
}

export const Input = forwardRef(InputBase)
