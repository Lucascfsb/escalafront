import { shade } from 'polished'
import styled from 'styled-components'

export const Container = styled.nav`
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

    li {
      padding: 15px 20px;
      color: #f4ede8;
      font-size: 18px;
      cursor: pointer;
      border-radius: 10px;

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
