import styled from 'styled-components'
import Link from 'next/link'

import useToken from '../hooks/useToken'
import { TOKENS_BY_ID, formatEth } from '../utils'

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
  const { balance } = useToken(assetFrom)

  const tokenFrom = assetFrom === 'eth'
    ? { id: 'eth', name: 'ETH' }
    : TOKENS_BY_ID[assetFrom]

  const tokenTo = TOKENS_BY_ID[assetTo]

  return (
    <Card>
      {logo}
      <Balance>{`${formatEth(balance)}`}</Balance>
      <Available>{tokenFrom.name} Available</Available>

      <Link href={`/${tokenFrom.id}-to-${tokenTo.id}`}>
        <Button>Convert to {tokenTo.name}</Button>
      </Link>
    </Card>
  )
}
