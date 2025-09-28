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
  }

  form {
    background: ${shade(0.05, '#312e38')};
    padding: 20px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 4px;
    border: 1px solid ${shade(0.1, '#808000')};
  }
`

export const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  margin-top: 10px;
`
