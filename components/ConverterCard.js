import { useEffect } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import useSWR from 'swr'
import { useWeb3React } from '@web3-react/core'
import { Contract } from '@ethersproject/contracts'
import { formatEther } from '@ethersproject/units'

import ERC20ABI from '../abi/ERC20.abi.json'
import { TOKENS_BY_NETWORK } from '../utils'

import Card from './Card'

const Balance = styled.div`
  margin-top: 36px;
  font-family: 'Share Tech Mono', monospace;
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

function getTokenAddress(asset, chainId) {
  const { address } =
    TOKENS_BY_NETWORK[chainId].find(
      ({ name }) => name.toLowerCase() === asset.toLowerCase()
    ) || {}
  return address
}

export default function ConverterCard({ tokenConfig }) {
  const { assetFrom, assetTo, logo } = tokenConfig
  const { account, library, chainId } = useWeb3React()

  const tokenAddress =
    assetFrom !== 'ETH' && getTokenAddress(assetFrom, chainId)

  const swrFetcherConfig =
    assetFrom === 'ETH'
      ? ['getBalance', account, 'latest']
      : [tokenAddress, 'balanceOf', account]

  const { data: balance, mutate } = useSWR(swrFetcherConfig)

  useEffect(() => {
    // listen for changes on an Ethereum address

    if (assetFrom === 'ETH') {
      console.log(`listening for blocks...`)

      library.on('block', () => {
        console.log('update balance...')
        mutate(undefined, true)
      })
      // remove listener when the component is unmounted
      return () => library.removeAllListeners('block')
    }

    const contract = new Contract(tokenAddress, ERC20ABI, library.getSigner())
    const fromMe = contract.filters.Transfer(account, null)
    library.on(fromMe, (from, to, amount, event) => {
      console.log('Transfer|sent', { from, to, amount, event })
      mutate(undefined, true)
    })
    const toMe = contract.filters.Transfer(null, account)
    library.on(toMe, (from, to, amount, event) => {
      console.log('Transfer|received', { from, to, amount, event })
      mutate(undefined, true)
    })
    // remove listener when the component is unmounted
    return () => {
      library.removeAllListeners(toMe)
      library.removeAllListeners(fromMe)
    }

    // trigger the effect only on component mount
  }, [])

  return (
    <Card>
      {logo}
      <Balance>{`${parseFloat(formatEther(balance || '0')).toPrecision(
        6
      )}`}</Balance>
      <Available>{assetFrom} Available</Available>

      <Link href={`/${assetFrom.toLowerCase()}-to-${assetTo.toLowerCase()}`}>
        <Button>Convert to {assetTo}</Button>
      </Link>
    </Card>
  )
}
