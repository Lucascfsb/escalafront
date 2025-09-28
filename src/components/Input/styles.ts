import { css } from 'styled-components'
import styled from 'styled-components'

import { Tooltip } from '../Tooltip'

interface ContainerProps {
  $isFocused: boolean
  $isFilled: boolean
  $isErrored: boolean
}

export const Container = styled.div<ContainerProps>`
  background: #e8e8e8;
  border-radius: 10px;
  padding: 16px;
  width: 100%;
  border: 2px solid #b8b8a8;
  color: #333;
  display: flex;
  align-items: center;
  color: #999;

  & + div {
      margin-top: 8px;
  }

    ${props =>
      props.$isFilled &&
      css`
      color: #556b2f;
  `}

  ${props =>
    props.$isErrored &&
    css`
      border-color: #c53030;
  `}

  ${props =>
    props.$isFocused &&
    css`
      border-color: #4CAF50;
      background-color: #fff;
  `}

  input {    
    flex:1;  
    background: transparent;
    border: 0;
    color: #333;
    padding-right: 16px;
  };
  

  svg {
    margin-right: 19px;
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

export const RightIconContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
  cursor: pointer;
`
