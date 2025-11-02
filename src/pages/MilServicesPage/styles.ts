import { shade } from 'polished'
import styled from 'styled-components'

export const MainContent = styled.div`
  flex: 1;
  color: #f4ede8;
  padding: 32px;
  background: linear-gradient(to bottom, ${shade(0.05, '#808000')}, #312e38);
  border-radius: 8px;
  margin: 12px;

  h2 {
    color: #f0c14b;
    margin-bottom: 8px;
    font-size: 28px;
    display: flex;
    
    align-items: center; 
    justify-content: space-between; 

    margin-bottom: 0;
  }
`

export const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  margin-top: 10px;

  button {
    padding: 10px 15px; 
    
    width: auto; 
    
    display: flex;
    align-items: center;
    justify-content: center;
  }
`
