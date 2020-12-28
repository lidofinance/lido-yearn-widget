import styled from 'styled-components'

import { useWeb3React } from '@web3-react/core'

import { injectedConnector } from '../connectors'
import { blue, white } from './colors'

const StyledButton = styled.button`
  padding: 12px 24px;
  border-radius: 6px;
  background-color: ${blue};
  font-size: 16px;
  line-height: 24px;
  color: ${white};
  border: none;
  outline: none;
`

export default function WalletButton() {
  const { account, activate, active } = useWeb3React()

  return (
    <StyledButton onClick={() => activate(injectedConnector)}>
      {active ? formatAddress(account) : 'Connect wallet'}
    </StyledButton>
  )
}

function formatAddress(address) {
  return `${address.substring(0, 6)}...${address.substring(38)}`
}
