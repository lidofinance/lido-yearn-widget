import styled from 'styled-components'

import Page from '../components/Page'
import Converter from '../components/Converter'

import { TokenIds } from '../utils'

const Title = styled.div`
  margin: 0 auto;
  text-align: center;
  margin-top: 56px;
  color: #2a2a2a;
  font-size: 32px;
  max-width: 600px;
`
const Subtitle = styled.div`
  margin: 0 auto;
  text-align: center;
  margin-top: 8px;
  color: #505a7a;
  font-size: 16px;
  width: 60%;
  max-width: 400px;
`

export default function StETHToYvStETH() {
  return (
    <Page>
      <Title>stETH to yvstETH</Title>
      <Subtitle>
        First, approve Yyear Vault contract to spend stETH tokens, than swap.
      </Subtitle>
      <Converter from={TokenIds.STETH} to={TokenIds.YVSTETH} />
    </Page>
  )
}
