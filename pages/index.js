import styled from 'styled-components'
import { useRouter } from 'next/router'

import ConverterCard from '../components/ConverterCard'
import Converter from '../components/Converter'

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

const ConverterSubtitle = styled(Subtitle)`
  max-width: 400px;
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
    glow: '#49DCE9',
    bg: '#1CA5FC'
  },
  {
    assetFrom: TokenIds.YVSTETH,
    assetTo: TokenIds.STETH,
    logo: <YearnLido />,
    glow: '#1767BF',
    bg: '#2EA6EE'
  },
  {
    assetFrom: 'eth',
    assetTo: TokenIds.YVSTETH,
    logo: <Eth />,
    bg: '#000000',
    glow: '#626263'
  },
]

export default function DefaultPage() {
  const router = useRouter()
  switch (router.query.view) {
    case 'steth-to-yvsteth': return StethToYvsteth()
    case 'yvsteth-to-steth': return YvstethToSteth()
    case 'eth-to-yvsteth': return EthToYvsteth()
    default: return ConversionsList()
  }
}

function ConversionsList() {
  return (
    <>
      <Title>Yearn Lido St. Ether Vault</Title>
      <Subtitle>
        A wrapper for Lido stETH which uses underlying shares instead of
        balances that can change outside transfers. Built for DeFi.
      </Subtitle>
      <CardWrapper>
        {conversions.map((tokenConfig) => (
          <ConverterCard
            tokenConfig={tokenConfig}
            glow={tokenConfig.glow}
            bg={tokenConfig.bg}
            key={`${tokenConfig.assetFrom}-${tokenConfig.assetTo}-converter`}
          />
        ))}
      </CardWrapper>
    </>
  )
}

function EthToYvsteth() {
  return (
    <>
      <Title>ETH to yvstETH</Title>
      <Converter from="eth" to={TokenIds.YVSTETH} />
    </>
  )
}

function StethToYvsteth() {
  return (
    <>
      <Title>stETH to yvstETH</Title>
      <ConverterSubtitle>
        First, approve Yearn Lido St. Ether Vault contract to spend your stETH
        tokens, then swap.
      </ConverterSubtitle>
      <Converter from={TokenIds.STETH} to={TokenIds.YVSTETH} />
    </>
  )
}

function YvstethToSteth() {
  return (
    <>
      <Title>yvstETH to stETH</Title>
      <Converter from={TokenIds.YVSTETH} to={TokenIds.STETH} />
    </>
  )
}
