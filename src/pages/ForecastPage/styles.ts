import { shade } from 'polished'
import styled, { keyframes } from 'styled-components'

const appearFromRight = keyframes`
  from{
    opacity: 0;
    transform: translate(150px);
  }
  to{
    opacity: 1;
    transform: translateY(0);
  }
`

export const MainContent = styled.div`
  flex: 1;
  color: #f4ede8;
  padding: 32px;
  background: linear-gradient(to bottom, ${shade(0.05, '#808000')}, #312e38);
  border-radius: 8px;
  margin: 12px;

  animation: ${appearFromRight} 1s;

  h2 {
    color: #f0c14b;
    margin-bottom: 8px;
    font-size: 28px;
  }
`
