import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import useSWR from 'swr'

export default function useEthBalance() {
  const { account, library } = useWeb3React()
  const { data: balance, mutate } = useSWR(['getBalance', account, 'latest'])
  useEffect(() => {
    if (!account || !library) {
      return
    }
    // listen for changes on an Ethereum address

    console.log(`listening for blocks...`)

    const onBlock = () => {
      console.log('update balance...')
      mutate(undefined, true)
    }

    library.on('block', onBlock)

    // remove listener when the component is unmounted
    return () => library.off('block', onBlock)

    // trigger the effect only on component mount
  }, [])

  return balance
}
