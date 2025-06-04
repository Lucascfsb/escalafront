import styled from 'styled-components'

import { shade } from 'polished'

export const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: stretch;  
  position: relative; 
  background: linear-gradient(to bottom, ${shade(0.1, '#3d3d00')}, ${shade(0.1, '#808000')});


  >header {
    height: 144px;
    background: linear-gradient(to bottom, ${shade(0.1, '#3d3d00')}, ${shade(
      0.1,
      '#808000'
    )});
    display: flex; 
    align-items: center; 
    padding-left: 24px; 

    div {
      width: 100%;
      max-width: 1120px;
      margin: 0 auto;

      svg{
        color: #999591;
        width: 24px;
        height: 24px;
      }
    }
  }
`
export const Content = styled.div`
  display: flex;  
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  justify-content: center;

  width: 100%;
  padding: 32px;


  form {
      width: 340px;
      text-align: center;
      display: flex;
      flex-direction: column;
      margin-top: -128px;


    h1 {
      margin-bottom: 24px;
      font-size: 20px;
      text-align: left;
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

    input [name='oldPassword']{
      margin-top:24px
    }
  }  
`

export const AvataInput = styled.div`
  margin-bottom: 32px;
  position: relative;
  align-self: center;
  width: 186px;

  img{
    width: 200px;
    height: 200px;
    border-radius: 50%;
  }

  label {
    position: absolute;
    width: 48px;
    height: 48px;
    background: #f0c14b;
    border-radius: 50%;
    right: 0;
    bottom: 0;
    border: 0;
    cursor: pointer;
    transition: background-color 0.2s;

    display: flex;
    align-items: center;
    justify-content: center;

    input {
      display: none;
    }

    svg{
      width: 20px;
      height: 20px;
      color: #312e38
    }

    &:hover {
      background: ${shade(0.2, '#f0c14b')};
    }
  }
`
