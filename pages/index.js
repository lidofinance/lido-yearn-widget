import styled from 'styled-components'

import ConverterCard from '../components/ConverterCard'

import Eth from '../components/token-logos/Eth'
import Lido from '../components/token-logos/Lido'
import YearnLido from '../components/token-logos/YearnLido'

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
  max-width: 600px;
`

const CardWrapper = styled.div`
  margin-top: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const conversions = [
  {
    assetFrom: TokenIds.STETH,
    assetTo: TokenIds.YVSTETH,
    logo: <Lido />,
  },
  {
    assetFrom: TokenIds.YVSTETH,
    assetTo: TokenIds.STETH,
    logo: <YearnLido />,
  },
  {
    assetFrom: 'eth',
    assetTo: TokenIds.YVSTETH,
    logo: <Eth />,
  },
]

export default function DefaultPage() {
  return (
    <>
      <Title>Yearn Lido St. Ether Vault</Title>
      <Subtitle>
        A wrapper for Lido stETH which uses underlying shares instead of
        balances which can change outside transfers. Built for DeFi.
      </Subtitle>
      <CardWrapper>
        {conversions.map((tokenConfig) => (
          <ConverterCard
            tokenConfig={tokenConfig}
            key={`${tokenConfig.assetFrom}-${tokenConfig.assetTo}-converter`}
          />
        ))}
      </CardWrapper>
    </>
  )
}
