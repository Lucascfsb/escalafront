import styled from 'styled-components'

export const Container = styled.div`
  background: #e8e8e8;
  border-radius: 10px;
  border: 2px solid #dcdcdc;
  padding: 16px;
  width: 100%;
  color: #333;
  display: flex;
  align-items: center;
  color: #999;

  & + div {
      margin-top: 8px;
  }

  input {    
    flex:1;  
    background: transparent;
    border: 0;
    color: #333;
  };

  svg {
    margin-right: 16px;
  }
`
