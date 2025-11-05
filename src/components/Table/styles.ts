import { shade } from 'polished'
import styled from 'styled-components'

export const TableContainer = styled.div`
  overflow: visible; 
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  position: relative; 

`

export const TableComponent = styled.table`
  width: 100%;
  border-collapse: separate; 
  position: relative;
`

export const TableHeader = styled.th`
  background: linear-gradient(to bottom, ${shade(0.45, '#282A3A')}, #312e38);
  padding: 4px 8px;
  font-weight: bold;
  color: #f4ede8;
  border: 2px solid #ccc;
  position: relative;
  z-index: 1; 
`

export const TableData = styled.td`
  padding: 4px 8px;
  border: 2px solid #ccc;
  color: #f4ede8;
  background: linear-gradient(to bottom, ${shade(0.45, '#282A3A')}, #312e38);
  position: relative;
  z-index: 1; 

  &:first-child {
    font-weight: bold;
  }

    &:focus-within {
    z-index: 100;
  }
`

export const SelectWrapper = styled.div`
  position: relative; 
  z-index: inherit;

  > div {
    margin: 0;
    padding: 0;
  }

  > div > div:first-child { 
      display: none;
  }

  input {
    color: #f4ede8 ;
  }
`
