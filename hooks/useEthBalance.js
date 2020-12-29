import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import useSWR from 'swr'

export default function useEthBalance() {
  const { account, library } = useWeb3React()
  const { data: balance, mutate } = useSWR(['getBalance', account, 'latest'])
  useEffect(() => {
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

  return balance
}
