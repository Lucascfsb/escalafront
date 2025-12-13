import { shade } from 'polished'
import styled from 'styled-components'

export const PageContainer = styled.div`
  padding: 32px;
  flex: 1;
  margin: 12px;
  border-radius: 8px;
  background: linear-gradient(to bottom, ${shade(0.05, '#808000')}, #312e38);

  h1 {
    color: #f0c14b;
    margin-bottom: 8px;
    font-size: 28px;
  }

  h3 {
    margin-bottom: 1rem;
  }
`

export const NavigationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 1rem;
  gap: 1rem;
`

export const SuggestionTable = styled.table`
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`

export const TableHeader = styled.th`
  background: linear-gradient(to bottom, ${shade(0.45, '#282A3A')}, #312e38);
  color: #fff;
  padding: 4px 8px;
  text-align: center;
  border: 2px solid #ccc;
  border-radius: 8px;


  &:first-child {
    min-width: 150px;
  }
`

interface TableCellProps {
  isServiceName?: boolean
}

export const TableCell = styled.td<TableCellProps>`
  padding: 4px 8px;
  border: 2px solid #ddd;
  text-align: center;
  background: ${props => (props.isServiceName ? `linear-gradient(to bottom, ${shade(0.45, '#282A3A')}, #312e38)` : `linear-gradient(to bottom, ${shade(0.45, '#282A3A')}, #312e38)`)};
`

interface MilitaryCardProps {
  rank: number
}

export const MilitaryCard = styled.div<MilitaryCardProps>`
  background: ${props => {
    if (props.rank === 1) return '#e8f5e9'
    if (props.rank === 2) return '#fff3e0'
    if (props.rank === 3) return '#fce4ec'
  }};
    ${props => {
      if (props.rank === 1) return '#4caf50'
      if (props.rank === 2) return '#ff9800'
      if (props.rank === 3) return '#e91e63'
    }};
  padding: 4px 8px;
  margin-bottom: 2px;
  border-radius: 4px;
  font-size: 12px;

  .rank {
    display: inline-block;
    background: ${props => {
      if (props.rank === 1) return '#4caf50'
      if (props.rank === 2) return '#ff9800'
      if (props.rank === 3) return '#e91e63'
    }};
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 12px;
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: center;
    font-size: 14px;

    strong {
      color: #333;
    }

    .stats {
      display: flex;
      gap: 16px;
      color: #666;

      span {
        display: flex;
        align-items: center;
      }
    }
  }
`
