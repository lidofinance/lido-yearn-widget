import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import useSWR from 'swr'
import { Contract } from '@ethersproject/contracts'
import ERC20ABI from '../abi/ERC20.abi.json'
import { TOKENS_BY_NETWORK } from '../utils'

export default function useTokenBalance(token) {
  const { account, library, chainId } = useWeb3React()
  const tokenAddress = getTokenAddress(token, chainId)

  const { data: balance, mutate } = useSWR([tokenAddress, 'balanceOf', account])
  useEffect(() => {
    if (!tokenAddress) {
      return
    }

    // listen for changes on an Ethereum address

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

  return balance
}

function getTokenAddress(token, chainId) {
  const { address } =
    TOKENS_BY_NETWORK[chainId].find(
      ({ name }) => name.toLowerCase() === token.toLowerCase()
    ) || {}
  return address
}
