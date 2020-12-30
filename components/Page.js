import { useState, useEffect, useMemo } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import Head from 'next/head'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import fetcher from 'swr-eth'
import { SWRConfig } from 'swr'
import { useWeb3React } from '@web3-react/core'
import Header from './Header'
import { useEagerConnect } from '../hooks/useEagerConnect'
import { useInactiveListener } from '../hooks/useInactiveListener'
import { VALID_TOKEN_IDS, getTokenConfig, Networks } from '../utils'

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

  const triedEager = useEagerConnect()
  useInactiveListener(!triedEager)

  const ABIs = useMemo(() => {
    return VALID_TOKEN_IDS.map((tokenId) => {
      const { address, abi } = getTokenConfig(tokenId, chainId)
      return [address, abi]
    })
  }, [chainId])

  const networkSupported = Object.values(Networks).indexOf(chainId) !== -1
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
        {!active && 'Connect to Ethereum wallet'}
        {active &&
          !networkSupported &&
          `Network isn't supported, please, use Mainnet or Rinkeby`}
        {active && networkSupported && children}
      </PageContainer>
    </SWRConfig>
  )
}
