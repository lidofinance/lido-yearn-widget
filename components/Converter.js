import { BigNumber } from '@ethersproject/bignumber'
import { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'

import TxPopup from './TxPopup'

import useTokenSwap, { TX_APPROVE, TX_SWAP } from '../hooks/useTokenSwap'
import { TOKENS_BY_ID, NetworkConfigs, formatEth } from '../utils'

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

const EtherscanLink = styled.a`
  display: block;
`

const TEN_TO_18 = BigNumber.from(10).pow(18)

const DISPLAY_PRECISION = 4
const DISPLAY_MULT = Math.pow(10, DISPLAY_PRECISION)
const PLACEHOLDER = (0).toFixed(DISPLAY_PRECISION)


export default function Converter({ to: assetTo, from: assetFrom }) {
  const [fromDisplayAmount, setFromDisplayAmount] = useState('')
  const [fromAmount, setFromAmount] = useState(BigNumber.from(0))

  const [toDisplayAmount, setToDisplayAmount] = useState('')
  const [toAmount, setToAmount] = useState(BigNumber.from(0))

  const {
    isSubmit,
    isDeposit,
    balanceFrom,
    balanceTo,
    isApprovalSufficient,
    stEthPerYvstEth,
    isFetching,
    txType,
    txHash,
    doApprove,
    doSwap,
  } = useTokenSwap(assetFrom, assetTo, fromAmount)

  const makeAmtChangeListener = ({
    setSrcAmount, setSrcDisplayAmount,
    setDstAmount, setDstDisplayAmount,
    isToYvstEth
  }) => (e) => {
    const value = Number(e.target.value)
    if (isNaN(value) || value < 0) {
      return
    }
    setSrcDisplayAmount(e.target.value)
    if (isFetching) {
      return
    }
    const srcAmount = parseAmount(value)
    const dstAmount = isToYvstEth
      ? srcAmount.mul(TEN_TO_18).div(stEthPerYvstEth)
      : srcAmount.mul(stEthPerYvstEth).div(TEN_TO_18)
    setSrcAmount(srcAmount)
    setDstAmount(dstAmount)
    setDstDisplayAmount(formatAmount(dstAmount))
  }

  const onFromAmtChanged = makeAmtChangeListener({
    setSrcAmount: setFromAmount,
    setSrcDisplayAmount: setFromDisplayAmount,
    setDstAmount: setToAmount,
    setDstDisplayAmount: setToDisplayAmount,
    isToYvstEth: isSubmit || isDeposit
  })

  const onToAmtChanged = makeAmtChangeListener({
    setSrcAmount: setToAmount,
    setSrcDisplayAmount: setToDisplayAmount,
    setDstAmount: setFromAmount,
    setDstDisplayAmount: setFromDisplayAmount,
    isToYvstEth: !(isSubmit || isDeposit)
  })

  const nameFrom = isSubmit ? 'ETH' : TOKENS_BY_ID[assetFrom].name
  const nameTo = TOKENS_BY_ID[assetTo].name

  const amountsAreNonZero = fromAmount.gt(0) && toAmount.gt(0)
  const approveDisabled = isFetching || !!txType || isApprovalSufficient
  const swapDisabled = isFetching || !!txType || !isApprovalSufficient || !amountsAreNonZero

  return (
    <Center>
      {renderPopup(txType, txHash, nameFrom, nameTo, fromDisplayAmount, toDisplayAmount)}
      <Panel>
        <TokenInput>
          <TokenInputFirstRow>
            <span>From</span>
            <span>Balance: {formatEth(balanceFrom)}</span>
          </TokenInputFirstRow>
          <TokenInputSecondRow>
            <Input
              value={fromDisplayAmount}
              onChange={(e) => onFromAmtChanged(e)}
              placeholder={PLACEHOLDER}
            />
            <span>{nameFrom}</span>
          </TokenInputSecondRow>
        </TokenInput>
        <PricePerShare>Rate: {formatEth(stEthPerYvstEth)}</PricePerShare>
        <TokenInput>
          <TokenInputFirstRow>
            <span>To</span>
            <span>Balance: {formatEth(balanceTo)}</span>
          </TokenInputFirstRow>
          <TokenInputSecondRow>
            <Input
              value={toDisplayAmount}
              onChange={(e) => onToAmtChanged(e)}
              placeholder={PLACEHOLDER}
            />
            <span>{nameTo}</span>
          </TokenInputSecondRow>
        </TokenInput>
        <ButtonContainer>
          {isDeposit
            ? <ButtonTag disabled={approveDisabled} onClick={doApprove}>Approve</ButtonTag>
            : null}
          <ButtonTag disabled={swapDisabled} onClick={doSwap}>Swap</ButtonTag>
        </ButtonContainer>
      </Panel>
    </Center>
  )
}

function renderPopup(txType, txHash, nameFrom, nameTo, displayAmountFrom, displayAmountTo) {
  const { chainId } = useWeb3React()
  if (!txType) {
    return null
  }
  const { etherscanAddress } = NetworkConfigs[chainId]
  return <TxPopup
    header={txHash ? 'Confirming...' : 'Signing...'}
    text={txType === TX_APPROVE
      ? `Approve Yearn St. Ether Vault to spend your ${nameFrom} tokens`
      : `Swap ${displayAmountFrom} ${nameFrom} to ${displayAmountTo} ${nameTo}`}
    action={renderTxAction(txHash, etherscanAddress)}
  />
}

function renderTxAction(txHash, etherscanAddress) {
  if (!txHash) {
    return <span>Please confirm the transaction in your wallet</span>
  }
  return <>
    <span>Waiting until the transaction is included in a block.</span>
    <EtherscanLink href={`${etherscanAddress}/tx/${txHash}`} target="_blank">
      See on Etherscan
    </EtherscanLink>
  </>
}

function parseAmount(amount) {
  return TEN_TO_18.mul(Math.floor(Number(amount) * DISPLAY_MULT)).div(DISPLAY_MULT)
}

function formatAmount(wei) {
  return (wei.mul(DISPLAY_MULT).div(TEN_TO_18).toNumber() / DISPLAY_MULT).toFixed(DISPLAY_PRECISION)
}
