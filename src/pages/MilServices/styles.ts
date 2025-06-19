import { shade } from 'polished'
import styled, { keyframes } from 'styled-components'

const appearFromleft = keyframes`
  from{
    opacity: 0;
    transform: translate(-50px);
  }
  to{
    opacity: 1;
    transform: translate(0);
  }
`

const appearFromTop = keyframes`
  from{
    opacity: 0.5;
    transform: translateY(-50px);
  }
  to{
    opacity: 1;
    transform: translateY(0);
  }
`

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

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #312e38;

    animation: ${appearFromleft} 1s;

`

export const Header = styled.header`
  padding: 32px 0;
  background: linear-gradient(to bottom, ${shade(0.1, '#3d3d00')}, ${shade(0.1, '#808000')});
  width: 100%;
  flex-shrink: 0; 
  
  animation: ${appearFromTop} 0.8s;

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

export const Content = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #312e38;
  overflow-y: auto; 
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
    gap: 15px;
    margin-bottom: 4px;
    border: 1px solid ${shade(0.1, '#808000')};
  }
`

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;

  button {
    background: #f0c14b; 
    color: #312e38; 
    border: 0;
    border-radius: 5px;
    padding: 10px 15px;
    font-weight: 500;
    transition: background-color 0.2s;
    width: auto; 

    &:hover {
      background: ${shade(0.2, '#f0c14b')};
    }

    &:disabled {
      background: ${shade(0.4, '#f0c14b')}; 
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  
  span {
    color: #f4ede8;
    align-self: center; 
    font-weight: bold;
  }
`
