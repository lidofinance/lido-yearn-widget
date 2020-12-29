import {useState} from 'react'
import styled from 'styled-components'

import { white } from './colors'

const Center = styled.div`
  margin-top: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Panel = styled.div`
  background: ${white};
  border-radius: 16px;
  width: 400px;
  height: 336px;
  border-radius: 16px;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: stretch;
  padding: 16px;
`

const TokenInput = styled.div`
  border: 1px solid #d1d8df;
  height: 84px;
  border-radius: 12px;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
`

const TokenInputFirstRow = styled.div`
  padding: 12px;
  padding-bottom: 0px;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  line-height: 24px;
  color: #505a7a;
`

const TokenInputSecondRow = styled.div`
  padding: 12px;
  padding-top: 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 22px;
  font-weight: 500;
  color: #2a2a2a;
`

const Input = styled.input`
  padding: 0;
  margin: 0;
  padding-top: 7px;
  width: 100%;
  outline: none;
  border: none;

  font-family: 'Inconsolata';
  font-size: 32px;
  line-height: 32px;
  color: #2a2a2a;
  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #b5b7b9;
  }
`

const PricePerShare = styled.div`
  margin: 16px auto;
  text-align: center;
  font-size: 18px;
  color: #505a7a;
`

const ButtonContainer = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`

const ButtonTag = styled.button`
  width: 100%;
  border-radius: 6px;
  user-select: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: inline-block;
  text-align: center;
  padding: 14px 13px;
  height: 56px;
  background: ${(props) => (props.disabled ? '#F4F6F8' : '#1F7BF1')};
  color: ${(props) => (props.disabled ? '#B5B7B9' : 'white')};
  border: 1px solid transparent;

  &:hover {
    background: ${(props) => (props.disabled ? '#F4F6F8' : '#1366BF')};
  }

  &:last-child {
    margin-left: 16px;
  }

  &:first-child:last-child {
    margin-left: 0px;
  }
`

export default function Converter({ to, from }) {
  const needsApprove = from === 'StETH'

  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')

  function fromHandler(e) {
    setFromAmount(e.target.value)
    let value = parseFloat(e.target.value)
    if (!isNaN(value)) {
      setToAmount((value / 1.1201).toFixed(4))
    }
  }

  function toHandler(e) {
    setToAmount(e.target.value)
    let value = parseFloat(e.target.value)
    if (!isNaN(value)) {
      setFromAmount((value * 1.1201).toFixed(4))
    }
  }

  return (
    <Center>
      <Panel>
        <TokenInput>
          <TokenInputFirstRow>
            <span>From</span>
            <span>Balance: 23.0345</span>
          </TokenInputFirstRow>
          <TokenInputSecondRow>
            <Input
              value={fromAmount}
              onChange={(e) => fromHandler(e)}
              placeholder="0.0000"
            />
            <span>{from}</span>
          </TokenInputSecondRow>
        </TokenInput>
        <PricePerShare>Price per share: 1.1201</PricePerShare>
        <TokenInput>
          <TokenInputFirstRow>
            <span>To</span>
            <span>Balance: 0.0159</span>
          </TokenInputFirstRow>
          <TokenInputSecondRow>
            <Input
              value={toAmount}
              onChange={(e) => toHandler(e)}
              placeholder="0.0000"
            />
            <span>{to}</span>
          </TokenInputSecondRow>
        </TokenInput>
        <ButtonContainer>
          {needsApprove ? <ButtonTag>Approve</ButtonTag> : null }
          <ButtonTag disabled={true}>Swap</ButtonTag>
        </ButtonContainer>
      </Panel>
    </Center>
  )
}
