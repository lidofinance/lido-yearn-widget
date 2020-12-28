import styled from 'styled-components'
import Link from 'next/link'
import Card from './Card'

const Balance = styled.div`
  margin-top: 36px;
  font-family: 'Consolas', monospace;
  font-size: 32px;
  line-height: 24px;
  color: #2A2A2A;
`

const Available = styled.div`
  margin-top: 8px;
  font-size: 16px;
  line-height: 24px;
  color: #515B79;
`

const Button = styled.div`
  margin: 12px;
  background-color: #F4F6F8;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  padding: 12px;
  width: 256px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: #1477F5;
    color: #fff;
  }
`

export default function ConverterCard({ tokenConfig }) {
  const { assetFrom, assetTo, logo } = tokenConfig
  return (
    <Card>
      {logo}
      <Balance>0.000000</Balance>
      <Available>{assetFrom} Available</Available>

      <Link href={`/${assetFrom.toLowerCase()}-to-${assetTo.toLowerCase()}`}>
        <Button>
          Convert to {assetTo}
        </Button>
      </Link>
    </Card>
  )
}
