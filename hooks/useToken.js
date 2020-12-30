import { useEffect, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import useSWR from 'swr'
import { Contract } from '@ethersproject/contracts'

import { getTokenConfig } from '../utils'

export default function useToken(tokenId) {
  const { account, library, chainId } = useWeb3React()

  const tokenConfig = getTokenConfig(tokenId, chainId) || {}

  const contract = useMemo(() => {
    return library && tokenConfig.address
      ? new Contract(tokenConfig.address, tokenConfig.abi, library.getSigner())
      : null
  }, [library, tokenConfig.address, tokenConfig.abi])

  const isETH = tokenId === 'eth'

  const swrArgs = isETH
    ? ['getBalance', account, 'latest']
    : [tokenConfig.address, 'balanceOf', account]

  const { data: balance, mutate } = useSWR(swrArgs)

  const subscribeToETHUpdates = () => {
    if (!account || !library) {
      return
    }

    console.log(`listening for blocks...`)

    const onBlock = () => {
      console.log('update balance...')
      mutate(undefined, true)
    }

    library.on('block', onBlock)

    return () => library.off('block', onBlock)
  }

  const subscribeToTokenUpdates = () => {
    if (!account || !library || !contract) {
      return
    }

    const fromMe = contract.filters.Transfer(account, null)
    const toMe = contract.filters.Transfer(null, account)

    const onTransfer = (from, to, amount, event) => {
      console.log('Transfer', { from, to, amount, event })
      mutate(undefined, true)
    }

    library.on(fromMe, onTransfer)
    library.on(toMe, onTransfer)

    return () => {
      library.off(fromMe, onTransfer)
      library.off(toMe, onTransfer)
    }
  }

  const subscribeToUpdates = isETH ? subscribeToETHUpdates : subscribeToTokenUpdates
  useEffect(subscribeToUpdates, [library, contract, account])

  return { contract, balance }
}
