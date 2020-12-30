import { useMemo } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import Head from 'next/head'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import fetcher from 'swr-eth'
import { SWRConfig } from 'swr'
import { useWeb3React } from '@web3-react/core'
import Header from '../components/Header'
import WalletButton from '../components/WalletButton'
import { useEagerConnect } from '../hooks/useEagerConnect'
import { useInactiveListener } from '../hooks/useInactiveListener'
import { VALID_TOKEN_IDS, getTokenConfig, Chains } from '../utils'

const GlobalStyle = createGlobalStyle`
  *,
  *:before,
  *:after {
    box-sizing: border-box;
    font-family: 'Work Sans', sans serif;
  }
  body {
    background-color: #EEF2F4;
    margin: 0;
  }
`

const PageContainer = styled.div`
  background-color: #eef2f4;
`

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
  margin-bottom: 32px;
`

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`


function getLibrary(provider) {
  const library = new Web3Provider(provider, 'any')
  library.pollingInterval = 12000
  return library
}

export default function MyApp({ Component, pageProps }) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <SwrReadyPage>
        <Component {...pageProps} />
      </SwrReadyPage>
    </Web3ReactProvider>
  )
}

function SwrReadyPage({ children }) {
  const { active, chainId, library } = useWeb3React()

  const triedEager = useEagerConnect()
  useInactiveListener(!triedEager)

  const ABIs = useMemo(() => {
    return VALID_TOKEN_IDS.map((tokenId) => {
      const { address, abi } = getTokenConfig(tokenId, chainId)
      return [address, abi]
    })
  }, [chainId])

  const chainSupported = Object.values(Chains).indexOf(chainId) !== -1
  return (
    <SWRConfig value={{ fetcher: fetcher(library, new Map(ABIs)) }}>
      <PageContainer>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Work+Sans&family=Inconsolata:wght@400;500&display=swap"
            rel="stylesheet"
          />
        </Head>
        <GlobalStyle />
        <Header />
        <NotConnected active={active} chainSupported={chainSupported} />
        {active && chainSupported && children}
      </PageContainer>
    </SWRConfig>
  )
}

const NotConnected = ({active, chainSupported}) => {
  if (!active && !chainSupported) {
    return (
      <Wrapper>
        <Title>Yearn Lido St. Ether Vault</Title>
        <Subtitle>
          Network isn't supported, please, use Mainnet or Rinkeby
        </Subtitle>
      </Wrapper>
    )
  }

  if (!active) {
    return (
      <Wrapper>
        <Title>Yearn Lido St. Ether Vault</Title>
        <Subtitle>
          A wrapper for Lido stETH which uses underlying shares instead of
          balances which can change outside transfers. Built for DeFi.
        </Subtitle>
        <WalletButton>Connect to Ethereum wallet</WalletButton>
      </Wrapper>
    )
  }

  return null
}
