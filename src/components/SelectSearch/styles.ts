import styled, { css } from 'styled-components'

interface ContainerProps {
  $isErrored: boolean
}

export const SelectContainer = styled.div<ContainerProps>`
  background: #e8e8e8;
  border-radius: 10px;
  padding: 10px;
  width: 100%;
  border: 2px solid #b8b8a8;
  color: #333;
  display: flex;
  align-items: center;
  color: #999;


  & + div {
    margin-top: 8px;
  }

  &:focus-within {
    border-color: #f0c14b;
    background-color: #fff;
    color: #556b2f;
  }

  ${props =>
    props.$isErrored &&
    css`
      border-color: #c53030;
      color: #c53030;
    `}

  svg {
    margin-right: 6px;
  }
`

export const SelectStyles = styled.div`
  flex: 1;
  
  .custom-select__control {
    background-color: transparent;
    border: none;
    box-shadow: none;
    cursor: pointer;
  }

  .custom-select__control--is-focused {
    border-color: transparent !important;
  }

  .custom-select__value-container {
    padding: 0;
    align-items: center;
  }
  
  .custom-select__placeholder,
  .custom-select__single-value {
    font-size: 16px;
    color: #333;
    margin-left: 4px;
    margin-right: 0;
  }
  
  .custom-select__menu {
    z-index: 10;
  }
  
  .custom-select__option {
    font-size: 14px;
    background-color: white;
    color: black;
  }
  
  .custom-select__option--is-focused {
    background-color: #f0f0f0;
  }
  
  .custom-select__option--is-selected {
    background-color: #f0c14b;
    color: #fff;
  }
  
  .custom-select__indicator-separator {
    color: #999;
  }

  .custom-select__clear-indicator {
    padding: 3px; 
    margin-right: -2px; 
    cursor: pointer;
  }

  .custom-select__dropdown-indicator {
    padding: 3px; 
    display: flex; 
    
    svg {
      margin-left: 6px; 
      width: 16px; 
      height: 16px;
      margin-right: 0;
    }
  }
  
`

export const IconContainer = styled.div`
  margin-left: 6px;
  margin-right: 14px;
  display: flex;
  align-items: center;

`
