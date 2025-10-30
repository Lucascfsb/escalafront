import { shade } from 'polished'
import styled from 'styled-components'

export const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  
  z-index: 1050; 
  
  background-color: rgba(0, 0, 0, 0.7); 
  display: flex;
  justify-content: center;
  align-items: center;
  
  overflow-y: auto;
  padding: 20px;
`

export const Content = styled.div`
  background: linear-gradient(to bottom, ${shade(0.05, '#808000')}, #312e38);
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  
  max-width: 700px; 
  width: 95%;

  z-index: 1060; 

  max-height: 100vh;
`

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px 10px; 
  border-bottom: 1px solid #eee;

  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #f0c14b;
  }
  
  button {
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: #333;
    padding: 0;
    margin-left: 10px;
  }
`

export const Body = styled.div`
  padding: 20px;

  h3 {
    color: #f0c14b; 
    margin-bottom: 10px;
  }

  p {
    margin: 10px;
    line-height: 1.5;
    display: flex;
  }

  span {
    margin-left: 10px;
    color: #f0c14b;
  }
`
