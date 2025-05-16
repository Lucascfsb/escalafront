import { css } from 'styled-components'
import styled from 'styled-components'

import Tooltip from '../Tooltip'

interface ContainerProps {
  $isFocused: boolean
  $isFilled: boolean
  $isErrored: boolean
}

export const Container = styled.div<ContainerProps>`
  background: #e8e8e8;
  border-radius: 10px;
  padding: 16px;
  border: 2px solid #b8b8a8;
  display: flex;
  align-items: center;
  color: #999;

   ${props =>
     props.$isErrored &&
     css`
      border-color: #c53030;
  `}

  ${props =>
    props.$isFocused &&
    css`
      color: #556b2f;
      border-color: #556b2f;
  `}

  ${props =>
    props.$isFilled &&
    css`
      color: #556b2f;
  `}

  select {    
    flex: 1;
    background: transparent;
    border: 0;
    color: ${props => (props.$isFilled || props.$isFocused ? '#333' : '#999')};
    font-size: 16px;
    appearance: none;
    cursor: pointer;
    font-family: 'Roboto Slab', sans-serif;

    &:focus {
    outline: none;
    }

    option {
      color: #333;
      font-size: 16px; 
      font-family: 'Roboto Slab', sans-serif;
    }
  };
  
  svg {
    margin-right: 16px;
  }
`

export const ErrorContainer = styled(Tooltip)`
  height: 20px;
  margin-left: 16px;

  svg {
    margin: 0;
  }

  span {
    background: #c53030;
    color: #fff;

    &::before{
      border-color: #c53030 transparent;
    }
  }
`
