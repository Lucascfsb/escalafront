import { shade } from 'polished'
import styled from 'styled-components'

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;

  button {
    background: #f0c14b; 
    color: #312e38; 
    border: 0;
    border-radius: 5px;
    padding: 10px 15px;
    font-weight: 500;
    transition: background-color 0.2s;
    width: auto; 

    &:hover {
      background: ${shade(0.2, '#f0c14b')};
    }

    &:disabled {
      background: ${shade(0.4, '#f0c14b')}; 
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  
  span {
    color: #f4ede8;
    align-self: center; 
    font-weight: bold;
  }
`
