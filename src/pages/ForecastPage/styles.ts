import { shade } from 'polished'
import styled from 'styled-components'

export const MainContent = styled.div`
  flex: 1;
  padding: 32px;
  background: linear-gradient(to bottom, ${shade(0.05, '#808000')}, #312e38);
  border-radius: 8px;
  margin: 12px;

  h2 {
    color: #f0c14b;
    margin-bottom: 8px;
    font-size: 28px;
  }
`
