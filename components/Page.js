import styled, { createGlobalStyle } from 'styled-components'
import Head from 'next/head'

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
  min-height: 100vh;
  background-color: #EEF2F4;
`

export default function Page({ children }) {
  return (
    <PageContainer>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Work+Sans&display=swap"
          rel="stylesheet"
        />
      </Head>
      <GlobalStyle />
      {children}
    </PageContainer>
  )
}
