import styled from 'styled-components'

export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
`
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  
  width: 100%; 
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
