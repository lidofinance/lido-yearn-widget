import styled from 'styled-components'
import Link from 'next/link'

import useEthBalance from '../hooks/useEthBalance'
import useTokenBalance from '../hooks/useTokenBalance'
import { formatEth } from '../utils'

import Card from './Card'

const Balance = styled.div`
  margin-top: 36px;
  font-family: 'Inconsolata', monospace;
  font-size: 32px;
  line-height: 24px;
  color: #2a2a2a;
`

const Available = styled.div`
  margin-top: 8px;
  font-size: 16px;
  line-height: 24px;
  color: #515b79;
`

const Button = styled.div`
  margin: 12px;
  background-color: #f4f6f8;
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
    background-color: #1477f5;
    color: #fff;
  }
`

export default function ConverterCard({ tokenConfig }) {
  const { assetFrom, assetTo, logo } = tokenConfig

  const balance =
    assetFrom === 'ETH' ? useEthBalance() : useTokenBalance(assetFrom)

  return (
    <Card>
      {logo}
      <Balance>{`${formatEth(balance)}`}</Balance>
      <Available>{assetFrom} Available</Available>

      <Link href={`/${assetFrom.toLowerCase()}-to-${assetTo.toLowerCase()}`}>
        <Button>Convert to {assetTo}</Button>
      </Link>
    </Card>
  )
}
