import styled from 'styled-components'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { useWeb3React } from '@web3-react/core'

import { injectedConnector } from '../connectors'
import { formatEth } from '../utils'
import useToken from '../hooks/useToken'
import { blue, white, lightGray, denim } from './colors'

const ConnectButton = styled.button`
  margin-top: -3px;
  padding: 8px 24px;
  border-radius: 6px;
  background-color: ${blue};
  font-size: 16px;
  line-height: 24px;
  color: ${white};
  border: none;
  outline: none;
  cursor: pointer;

  &:hover {
    background: ${denim};
  }
`

const AddressBalancePanel = styled.div`
  margin-top: -2px;
  padding: 4px 4px 4px 12px;
  border-radius: 16px;
  background-color: ${white};
  color: #0B1637;
  font-weight: 300;
`

const Address = styled.span`
  display: inline-flex;
  align-items: center;
  border-radius: 100px;
  padding: 4px 8px;
  background-color: ${lightGray};
  color: #505A7A;
  font-weight: 300;
  font-size: 14px;
`

const Buffer = styled.span`
  width: 4px;
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
      <Address>
        {formatAddress(account)}
        <Buffer />
        <Jazzicon diameter={24} seed={jsNumberForAddress(account)} />
      </Address>
    </AddressBalancePanel>
  )
}

function formatAddress(address) {
  return `${address.substring(0, 6)}...${address.substring(38)}`
}
