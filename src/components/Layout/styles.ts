import { shade } from 'polished'
import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #312e38;
`

export const Content = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #312e38;
  overflow-y: auto; 
`

export const Header = styled.header`
  padding: 32px 0;
  background: linear-gradient(to bottom, ${shade(0.1, '#3d3d00')}, ${shade(0.1, '#808000')});
  width: 100%;
  flex-shrink: 0; 
  
`

export const HeaderContent = styled.div`
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: 0 32px;   

  > img {
    height: 80px;
  }

  button {
    margin-left: auto;
    background: transparent;
    border: 0;
    cursor: pointer;      
    padding: 10px;

    svg {
      color: #999591;
      width: 20px;
      height: 20px;
      transition: 0.2s;

      &:hover {
        opacity: 0.6;
      }
    }
  }
`

export const Profile = styled.div`
  display: flex;
  align-items: center;
  margin-left: 80px;

  img {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    object-fit: cover;
  }

  div {
    display: flex;
    flex-direction: column;
    margin-left: 16px;
    line-height: 24px;
  }

  span {
    color: #f4ede8;
  }

  a {
    text-decoration: none;
    color: #f0c14b;
    font-weight: bold;

    &:hover {
      opacity: 0.6;
    }
  }
`
