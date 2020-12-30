import styled from 'styled-components'

import { useWeb3React } from '@web3-react/core'

import { injectedConnector } from '../connectors'
import { formatEth } from '../utils'
import useToken from '../hooks/useToken'
import { blue, white, lightGray } from './colors'

const ConnectButton = styled.button`
  margin-top: -8px;
  padding: 12px 24px;
  border-radius: 6px;
  background-color: ${blue};
  font-size: 16px;
  line-height: 24px;
  color: ${white};
  border: none;
  outline: none;
`

const AddressBalancePanel = styled.div`
  padding: 7px 8px;
  border-radius: 16px;
  background-color: ${white};
`

const Address = styled.span`
  border-radius: 100px;
  padding: 5px 8px;
  background-color: ${lightGray};
`

export default function WalletButton() {
  const { account, activate, active } = useWeb3React()
  const { balance } = useToken('eth')

  if (!active) {
    return (
      <ConnectButton onClick={() => activate(injectedConnector)}>
        Connect wallet
      </ConnectButton>
    )
  }

  return (
    <AddressBalancePanel>
      {formatEth(balance)} <b>ETH</b>{' '}
      <Address>{formatAddress(account)}</Address>
    </AddressBalancePanel>
  )
}

function formatAddress(address) {
  return `${address.substring(0, 6)}...${address.substring(38)}`
}
