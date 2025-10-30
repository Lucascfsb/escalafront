import styled from 'styled-components'

export const TableContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 16px;
`
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  
  grid-column: 1 / -1; 
  padding: 80px 20px;
  
  color: #f0c14b; 
  font-size: 28px;
  line-height: 1.5;
  
  
  svg {
    margin-bottom: 15px;
    color: #f0c14b;
    font-size: 50px; 
  }
`
