import { useEffect } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import useSWR from 'swr'
import { useWeb3React } from '@web3-react/core'
import { formatEther } from '@ethersproject/units'

import Card from './Card'

const Balance = styled.div`
  margin-top: 36px;
  font-family: 'Consolas', monospace;
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
  const { account, library } = useWeb3React()
  console.info('account, library', account, library)

  const { data: balance, mutate } = useSWR(['getBalance', account, 'latest'])

  useEffect(() => {
    console.info('i am in effect')
    if (typeof window === 'undefined') {
      console.info('i am exiting effect')
      return
    }
    // listen for changes on an Ethereum address
    console.log(`listening for blocks...`)

    library.on('block', () => {
      console.log('update balance...')
      mutate(undefined, true)
    })
    // remove listener when the component is unmounted
    return () => library.removeAllListeners('block')
    // trigger the effect only on component mount
  }, [])

  console.log('received balance', balance)

  const balanceStr =
    assetFrom === 'ETH'
      ? `${parseFloat(formatEther(balance || '0')).toPrecision(4)} Ξ`
      : '0.000000'
  return (
    <Card>
      {logo}
      <Balance>{balanceStr}</Balance>
      <Available>{assetFrom} Available</Available>

      <Link href={`/${assetFrom.toLowerCase()}-to-${assetTo.toLowerCase()}`}>
        <Button>Convert to {assetTo}</Button>
      </Link>
    </Card>
  )
}
