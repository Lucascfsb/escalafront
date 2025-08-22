import styled from 'styled-components'

export const SelectStyles = styled.div`
  && .custom-select__control {
    width: 100%;
    min-height: 40px;
    padding: 2px;
    border: 2px solid #ccc;
    border-radius: 8px;
    background-color: #e8e8e8;
    cursor: pointer;
    box-shadow: none;
  }

  && .custom-select__control--is-focused {
    border-color: #007bff;
    box-shadow: 0 0 0 1px #007bff;
  }

  && .custom-select__value-container {
    padding: 0 8px;
  }

  && .custom-select__single-value,
  && .custom-select__placeholder {
    font-size: 16px;
  }

  && .custom-select__menu {
    z-index: 10; /* evita ficar atrás de outros elementos */
  }

  && .custom-select__option {
    font-size: 14px;
    background-color: white;
    color: black;
  }

  && .custom-select__option--is-focused {
    background-color: #f0f0f0;
  }

  && .custom-select__option--is-selected {
    background-color: #007bff;
    color: #fff;
  }

  && .custom-select__control--is-disabled {
    background-color: #f0f0f0;
    cursor: not-allowed;
  }
`
