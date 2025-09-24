import { shade } from 'polished'
import styled from 'styled-components'

export const Container = styled.div`
  background: ${shade(0.05, '#312e38')};
  padding: 20px;
  border-radius: 8px;
  margin: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: 1px solid ${shade(0.2, '#808000')};

  position: relative;

  .info-icon-button {
    position: absolute; 
    top: 20px;    
    right: 15px;  
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0; 
    line-height: 0; 

    svg {
      color: #f0c14b; 
      font-size: 24px;
      transition: color 0.2s;
    }

    &:hover svg {
      color: ${shade(0.2, '#f0c14b')}; 
    }
  }

  h3 {
    color: #f0c14b;
    margin-bottom: 10px;
    margin-right: 10px;
  }

  p {
    margin-bottom: 5px;
  }
`
