import styled from 'styled-components'

import { shade } from 'polished'

export const Container = styled.div`

`
export const Header = styled.header`
  padding: 32px 0;
  background: linear-gradient(to bottom, ${shade(0.1, '#3d3d00')}, ${shade(0.1, '#808000')});

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
    border: 2px solid red;
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

  img{
    width: 56px;
    height: 56px;
    border-radius: 50%;
    
  }

  div {
    display: flex;
    flex-direction: column;
    margin-left: 16px;
    line-height: 24px;
  }

  span{
    color: #F4ede8;
  }

  a{
    text-decoration: none;
    color: #f0c14b;

    &:hover {
      opacity: 0.6;
    }
  }
`

export const Sidebar = styled.nav`
  width: 250px; 
  background: linear-gradient(to bottom, ${shade(0.1, '#3d3d00')}, ${shade(0.1, '#808000')});  padding: 32px 0;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 2px 0 50px rgba(0, 0, 0, 0.2);

  height: 100vh;
  position: sticky;
  top: 0;  

  ul {
    list-style: none;
    padding: 25px;
    width: 100%;
    border: 2px solid red;


    li {
      padding: 15px;
      color: #f4ede8;
      font-size: 18px;
      cursor: pointer;
      transition: 0.3s;

      &:hover {
        opacity: 0.6;
      }
    }
  }
`
