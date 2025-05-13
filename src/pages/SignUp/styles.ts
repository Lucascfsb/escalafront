import styled from 'styled-components'

import { shade } from 'polished'

import signUpBackground from '../../assets/Carro-de-Combate.jpg'

export const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: stretch;
`
export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  max-width: 800px;  
  padding: 32px;


  background: linear-gradient(to bottom, ${shade(0.1, '#3d3d00')}, ${shade(0.1, '#808000')});


  img {
    max-width: 150px; 
    height: auto;
    margin-top: 62px;
  }

  form {
      margin: 50px 0;
      width: 340px;
      text-align: center;

    h1 {
      margin-bottom: 24px;
      color: #f4ede8;
    }

    a {
      color: #f4ede8;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: color 0.2s;


      &:hover {
      color: ${shade(0.2, '#f4ede8')};
      }
    }
  }  

  > a {
      color: #F5F5DC;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: color 0.2s;

      display: flex;
      align-items: center;
      transition: background-color 0.2s;

      &:hover {
      color: ${shade(0.2, '#F5F5DC')};
      }

      svg {
        margin-right: 16px;
      }
  }
`
export const Background = styled.div`
  flex: 1;
  background: url(${signUpBackground}) no-repeat 0px 0px;
  background-size: cover;
  background-position: -400px center;
`
