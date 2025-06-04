import styled from 'styled-components'

import { shade } from 'polished'

export const Container = styled.div`

`
export const Header = styled.header`
  padding: 32px 0;
  background: linear-gradient(to bottom, ${shade(0.1, '#3d3d00')}, ${shade(0.1, '#808000')});

`
export const HeaderContent = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  align-items: center;

  > img {
    height: 80px;
  }

  button {
    margin-left: auto;
    background: transparent;
    border: 0;

    svg {
      color: #999591;
      width: 20px;
      height: 20px;
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
      opacity: 0.8;
    }
  }
`
