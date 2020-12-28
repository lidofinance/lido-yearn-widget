import { useMemo } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import Head from 'next/head'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import fetcher from 'swr-eth'
import { SWRConfig } from 'swr'
import { useWeb3React } from '@web3-react/core'
import Header from './Header'
import { TOKENS_BY_NETWORK } from '../utils'

const GlobalStyle = createGlobalStyle`
  *,
  *:before,
  *:after {
    box-sizing: border-box;
    font-family: 'Work Sans', sans serif;
  }
  body {
    background-color: #EEF2F4;
  }
`

const PageContainer = styled.div`
  background-color: #eef2f4;
`

function getLibrary(provider) {
  const library = new Web3Provider(provider, 'any')
  library.pollingInterval = 12000
  return library
}

export default function Page({ children }) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <SwrReadyPage>{children}</SwrReadyPage>
    </Web3ReactProvider>
  )
}

function SwrReadyPage({ children }) {
  const { active, chainId, library } = useWeb3React()

  const ABIs = useMemo(() => {
    return (TOKENS_BY_NETWORK[chainId] || []).map(({ address, abi }) => [
      address,
      abi,
    ])
  }, [chainId])
  return (
    <SWRConfig value={{ fetcher: fetcher(library, new Map(ABIs)) }}>
      <PageContainer>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Work+Sans&family=Share+Tech+Mono&display=swap"
            rel="stylesheet"
          />
        </Head>
        <GlobalStyle />
        <Header />
        {active ? children : 'Connect to Ethereum wallet'}
      </PageContainer>
    </SWRConfig>
  )
}
