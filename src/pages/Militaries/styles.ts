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
    transform: translate(50px);
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

export const Sidebar = styled.nav`

  width: 260px;
  background: linear-gradient(to bottom, ${shade(0.1, '#3d3d00')}, ${shade(0.1, '#808000')});
  padding: 32px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);

  flex-shrink: 0;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 80px; 
    padding: 20px 0;

    > img { 
      height: 40px; 
      margin-bottom: 15px;
    }
  }

  > img {
    height: 60px;
    margin-bottom: 30px;
  }

  ul {
    list-style: none;
    padding: 0;
    width: 100%;

    animation: ${appearFromleft} 1s;

    li {
      padding: 15px 20px;
      color: #f4ede8;
      font-size: 18px;
      cursor: pointer;
      transition: background 0.3s, color 0.3s;

      &:hover {
        background: ${shade(0.2, '#3d3d00')};
        color: #fff;
      }

      &.active {
        background: ${shade(0.2, '#3d3d00')};
        border-left: 4px solid #f0c14b;
        font-weight: bold;
        color: #fff;
      }

      a {
        text-decoration: none;
        color: inherit;
        display: block;
        width: 100%;
        height: 100%;
      }
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
    margin-bottom: 5px;
    font-size: 28px;
  }

  form {
    background: ${shade(0.05, '#312e38')};
    padding: 20px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 40px;
    border: 1px solid ${shade(0.1, '#808000')};
  }


  ul {
    list-style: none;
    padding: 0;
  }

  li {
    background: ${shade(0.05, '#312e38')};
    margin-bottom: 10px;
    padding: 15px;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    border: 1px solid ${shade(0.1, '#312e38')};


    div:first-child {
      display: flex;
      flex-direction: column;
      gap: 5px;

    }

    span {
      display: block;
    }
  }

  .military-details {
    background: ${shade(0.05, '#312e38')};
    padding: 20px;
    border-radius: 8px;
    margin-top: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    border: 1px solid ${shade(0.2, '#808000')};

    display: flex;
    justify-content: space-between; 
    align-items: flex-start; 

    .button-group { 
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 0;
      flex-shrink: 0;

      button {
        margin-left: 0;
        margin-top: 0; 
        padding: 10px 15px;
        font-size: 16px;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.2s;
        width: 240px;


        &:first-of-type { 
          background: #f0c14b; 
          color: #312e38;
          &:hover {
            background: ${shade(0.2, '#f0c14b')};
          }
        }

        &:last-of-type { 
          background: #c53030;
          color: #fff;
          &:hover {
            background: ${shade(0.2, '#c53030')};
          }
        }
      }
    }

    h3 {
      color: #f0c14b;
      margin-bottom: 0; 
      margin-right: 10px; 
    }

    p {
      margin-bottom: 0; 
    }
  }
`
