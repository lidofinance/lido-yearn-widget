import styled from 'styled-components'

import Page from '../components/Page'
import ConverterCard from '../components/ConverterCard'

import Eth from '../components/token-logos/Eth'
import Lido from '../components/token-logos/Lido'
import YearnLido from '../components/token-logos/YearnLido'

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
  max-width: 600px;
`

const CardWrapper = styled.div`
  margin-top: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const tokens = [
  {
    assetFrom: 'StETH',
    assetTo: 'YvStETH',
    logo: <Lido />,
  },
  {
    assetFrom: 'YvStETH',
    assetTo: 'StETH',
    logo: <YearnLido />,
  },
  {
    assetFrom: 'ETH',
    assetTo: 'YvStETH',
    logo: <Eth />,
  },
]

export default function DefaultPage() {
  return (
    <Page>
      <Title>Yearn Lido St. Ether Vault</Title>
      <Subtitle>
        A wrapper for Lido stETH which uses underlying shares instead of
        balances which can change outside transfers. Built for DeFi.
      </Subtitle>
      <CardWrapper>
        {tokens.map((tokenConfig) => (
          <ConverterCard tokenConfig={tokenConfig} />
        ))}
      </CardWrapper>
    </Page>
  )
}
