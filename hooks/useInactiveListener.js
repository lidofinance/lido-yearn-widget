import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'

import { injectedConnector } from '../connectors'

export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3React()

  useEffect(() => {
    if (suppress) {
      return () => {}
    }
    const { ethereum } = window
    if (ethereum && ethereum.on && !active && !error) {
      const handleChainChanged = (chainId) => {
        console.log('chainChanged', chainId)
        activate(injectedConnector)
      }

      const handleAccountsChanged = (accounts) => {
        console.log('accountsChanged', accounts)
        if (accounts.length > 0) {
          activate(injectedConnector)
        }
      }

      const handleNetworkChanged = (networkId) => {
        console.log('networkChanged', networkId)
        activate(injectedConnector)
      }

      ethereum.on('chainChanged', handleChainChanged)
      ethereum.on('accountsChanged', handleAccountsChanged)
      ethereum.on('networkChanged', handleNetworkChanged)

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('chainChanged', handleChainChanged)
          ethereum.removeListener('accountsChanged', handleAccountsChanged)
          ethereum.removeListener('networkChanged', handleNetworkChanged)
        }
      }
    }

    return () => {}
  }, [active, error, suppress, activate])
}
