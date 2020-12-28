import styled from 'styled-components'

import Page from '../components/Page'
import Header from '../components/Header'
import Converter from '../components/Converter'

const Title = styled.div`
  margin: 0 auto;
  text-align: center;
  margin-top: 56px;
  color: #2A2A2A;
  font-size: 32px;
  max-width: 600px;
`
const Subtitle = styled.div`
  margin: 0 auto;
  text-align: center;
  margin-top: 8px;
  color: #505A7A;
  font-size: 16px;
  width: 60%;
  max-width: 400px;
`

export default function YvStETHToStETHT() {
  return (
    <Page>
      <Header />
      <Title>yvstETH to stETH</Title>
      <Subtitle>First, approve Yyear Vault contract to spent StETH tokens, than swap.</Subtitle>
      <Converter from="YvStETH" to="StETH" />
    </Page>
  )
}