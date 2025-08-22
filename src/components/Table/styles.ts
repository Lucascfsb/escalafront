import { shade } from 'polished'
import styled from 'styled-components'

export const TableContainer = styled.div`
  overflow-x: auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`
export const TableComponent = styled.table`
  width: 100%;
  border-collapse: collapse;
`

export const TableHeader = styled.th`
  background: linear-gradient(to bottom, ${shade(0.45, '#282A3A')}, #312e38);
  padding: 12px 16px;
  font-weight: bold;
  color: #f4ede8;
  border: 2px solid #ccc;
`

export const TableData = styled.td`
  padding: 12px 16px;
  border: 2px solid #ccc;
  color: #f4ede8;
  background: linear-gradient(to bottom, ${shade(0.45, '#282A3A')}, #312e38);

  &:first-child {
    font-weight: bold;
  }
`

export const SelectInput = styled.select`
  width: 100%;
  padding: 8px;
  border: 2px solid #ccc;
  border-radius: 4px;
  background-color: #e8e8e8;
  cursor: pointer;

  &:disabled {
    background-color: #f0f0f0;
    cursor: not-allowed;
  }
`
