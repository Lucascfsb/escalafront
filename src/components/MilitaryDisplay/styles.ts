import { shade } from 'polished'
import styled from 'styled-components'

export const Container = styled.div`
  background: ${shade(0.05, '#312e38')};
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 10px;
  margin-top: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: 1px solid ${shade(0.2, '#808000')};

  display: flex;
  flex-direction: row; 
  justify-content: space-between; 
  align-items: flex-start; 
  width: 100%;

  .military-info-details {
    padding: 4px;
  }

  .button-group {
    display: flex;
    flex-direction: column;

    button { 
      font-size: 16px;
      border-radius: 10px;
      cursor: pointer;
      transition: background 0.2s;
      width: 240px; 

      &:first-of-type {
        background: #f0c14b;
        color: #312e38;
        &:hover {
          background: ${shade(0.2, '#f0c14b')};
        }
      }

      &:last-of-type {
        background: #c53030;
        color: #fff;
        &:hover {
          background: ${shade(0.2, '#c53030')};
        }
      }
    }
  }

  h3 {
    color: #f0c14b;
    margin-bottom: 10px;
    margin-right: 10px;
  }

  p {
    margin-bottom: 4px;
  }
`
