import styled from 'styled-components'
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
  return <StyledButton>Connect wallet</StyledButton>
}
