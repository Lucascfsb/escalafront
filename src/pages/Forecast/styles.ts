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

export const TableContainer = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #28262E;
  color: #E1E1E6;
`

export const TableHeader = styled.th`
  border: 1px solid #3E3B47;
  padding: 8px;
  text-align: left;
  background-color: #312E38;
  text-align: center;
`

export const TableData = styled.td`
  border: 1px solid #3E3B47;
  padding: 8px;
  vertical-align: center;
`

export const SelectInput = styled.select`
  width: 100%;
  padding: 8px;
  margin-bottom: 2px;
  border-radius: 4px;
  border: 1px solid #5C5C66;
  background-color: #3E3B47;
  color: #E1E1E6;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`
