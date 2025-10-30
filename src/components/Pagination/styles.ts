import { shade } from 'polished'
import styled from 'styled-components'

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;

  > div:last-child {
    width: 80px;
    height: 42px;
    margin-top: 16px;
  }

  button {
    background: #f0c14b; 
    color: #312e38; 
    border: 0;
    border-radius: 5px;
    font-weight: 500;
    transition: background-color 0.2s;
    width: 40px;
    height: 40px;
    padding: 0;

    &:hover {
      background: ${shade(0.2, '#f0c14b')};
    }

    &:disabled {
      background: ${shade(0.4, '#f0c14b')}; 
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  svg {
    margin-left: 8px;
  }

  span {
    color: #f4ede8;
    font-weight: bold;
    margin-top: 12px;
  }
`
