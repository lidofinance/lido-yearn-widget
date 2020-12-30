import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import useSWR from 'swr'
import { Contract } from '@ethersproject/contracts'

import ERC20ABI from '../abi/ERC20.abi.json'
import { getTokenConfig } from '../utils'

export default function useTokenBalance(tokenId) {
  const { account, library, chainId } = useWeb3React()
  const tokenAddress = getTokenAddress(tokenId, chainId)

  const { data: balance, mutate } = useSWR([tokenAddress, 'balanceOf', account])
  useEffect(() => {
    if (!tokenAddress) {
      return
    }
    if (!account || !library) {
      return
    }

    // listen for changes on an Ethereum address
    const contract = new Contract(tokenAddress, ERC20ABI, library.getSigner())

    const fromMe = contract.filters.Transfer(account, null)
    const onTransferFromMe = (from, to, amount, event) => {
      console.log('Transfer|sent', { from, to, amount, event })
      mutate(undefined, true)
    }

    const toMe = contract.filters.Transfer(null, account)
    const onTransferToMe = (from, to, amount, event) => {
      console.log('Transfer|received', { from, to, amount, event })
      mutate(undefined, true)
    }

    library.on(fromMe, onTransferFromMe)
    library.on(toMe, onTransferToMe)

    // remove listener when the component is unmounted
    return () => {
      library.off(fromMe, onTransferFromMe)
      library.off(toMe, onTransferToMe)
    }

    // trigger the effect only on component mount
  }, [])

  return balance
}

function getTokenAddress(tokenId, chainId) {
  const config = getTokenConfig(tokenId, chainId)
  return config ? config.address : null
}
