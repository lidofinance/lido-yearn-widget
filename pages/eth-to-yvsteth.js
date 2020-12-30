import styled from 'styled-components'

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

export default function ETHToYvStETH() {
  return (
    <>
      <Title>ETH to yvstETH</Title>
      <Converter from="eth" to={TokenIds.YVSTETH} />
    </>
  )
}
