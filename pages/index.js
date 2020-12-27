import styled from 'styled-components'

import Page from '../components/Page'
import WalletButton from '../components/WalletButton'
import { blue, borderGray } from '../components/colors'

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
`
const Cell = styled.div`
  height: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Logos = styled.div`
  background: url('/logos.png') no-repeat;
  background-size: contain;
  height: 100%;
  width: 100%;
`

const Disclaimer = styled.span`
  font-size: 14px;
  line-height: 24px;
  color: ${blue};
  padding: 4px 8px;
  border: ${borderGray} solid 1px;
  border-radius: 8px;
`

export default function DefaultPage() {
  return (
    <Page>
      <Row>
        <Cell>
          <Logos />
        </Cell>
        <Cell>
          <Disclaimer>
            This project is in beta. Use at your own risk.
          </Disclaimer>
        </Cell>
        <Cell>
          <WalletButton />
        </Cell>
      </Row>
    </Page>
  )
}
