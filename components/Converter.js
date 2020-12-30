import { BigNumber } from '@ethersproject/bignumber'
import { useState, useMemo, useEffect } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import useSWR from 'swr'

import useToken from '../hooks/useToken'
import { TokenIds, TOKENS_BY_ID, formatEth } from '../utils'

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

const MAX_AMOUNT = BigNumber.from(2).pow(256).sub(1)
const TEN_TO_18 = BigNumber.from(10).pow(18)

const DISPLAY_PRECISION = 4
const DISPLAY_MULT = Math.pow(10, DISPLAY_PRECISION)
const PLACEHOLDER = (0).toFixed(DISPLAY_PRECISION)

export default function Converter({ to: assetTo, from: assetFrom }) {
  const isSubmit = assetFrom === 'eth'
  const isDeposit = assetFrom === TokenIds.STETH

  const tokenInfoFrom = isSubmit ? { id: 'eth', name: 'ETH' } : TOKENS_BY_ID[assetFrom]
  const tokenInfoTo = TOKENS_BY_ID[assetTo]

  const tokenFrom = useToken(assetFrom)
  const tokenTo = useToken(assetTo)
  const balanceFrom = tokenFrom.balance

  const vault = (isSubmit || isDeposit) ? tokenTo.contract : tokenFrom.contract

  // how many stETH wei one gets per 1e18 vystETH wei
  // 1e18 yvstETH = stEthPerYvstEth stETH
  // X stETH = (X * 1e18 / stEthPerYvstEth) vystETH
  // Y yvstETH = (Y * stEthPerYvstEth / 1e18) stETH
  const stEthPerYvstEth = useSWR([vault.address, 'pricePerShare']).data

  // FIXME: don't call the hook conditionally
  const approvedAmount = isDeposit
    ? useTokenAllowance(tokenFrom.contract, vault.address)
    : MAX_AMOUNT

  const isFetching = balanceFrom === undefined || approvedAmount === undefined
  const [isTransacting, setIsTransacting] = useState(false)
  const [txHash, setTxHash] = useState(null)

  const [fromDisplayAmount, setFromDisplayAmount] = useState('')
  const [toDisplayAmount, setToDisplayAmount] = useState('')

  const [fromAmount, setFromAmount] = useState(BigNumber.from(0))
  const [toAmount, setToAmount] = useState(BigNumber.from(0))

  const isApprovalSufficient = !isFetching && approvedAmount.gte(fromAmount)

  const makeAmtChangeListener = ({
    setSrcAmount, setSrcDisplayAmount,
    setDstAmount, setDstDisplayAmount,
    isToYvstEth
  }) => (e) => {
    setSrcDisplayAmount(e.target.value)
    const value = Number(e.target.value)
    if (isNaN(value) || isFetching) {
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

  const approveDisabled = isFetching || isTransacting || isApprovalSufficient
  const swapDisabled = isFetching || isTransacting || !isApprovalSufficient

  const doApprove = async () => {
    try {
      setIsTransacting(true)
      const tx = await tokenFrom.contract.approve(vault.address, MAX_AMOUNT)
      setTxHash(tx.hash)
      await tx.wait(1)
    } finally {
      setIsTransacting(false)
      setTxHash(null)
    }
  }

  // TODO: display a blocking popup
  // isTransacting == true, txHash == null => "Please sign the transaction"
  // isTransacting == true, txHash != null => "Waiting for inclusion in a block, hash: {txHash}"

  return (
    <Center>
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
            <span>{tokenInfoFrom.name}</span>
          </TokenInputSecondRow>
        </TokenInput>
        <PricePerShare>Rate: {formatEth(stEthPerYvstEth)}</PricePerShare>
        <TokenInput>
          <TokenInputFirstRow>
            <span>To</span>
            <span>Balance: {formatEth(tokenTo.balance)}</span>
          </TokenInputFirstRow>
          <TokenInputSecondRow>
            <Input
              value={toDisplayAmount}
              onChange={(e) => onToAmtChanged(e)}
              placeholder={PLACEHOLDER}
            />
            <span>{tokenInfoTo.name}</span>
          </TokenInputSecondRow>
        </TokenInput>
        <ButtonContainer>
          {isDeposit
            ? <ButtonTag disabled={approveDisabled} onClick={doApprove}>Approve</ButtonTag>
            : null}
          <ButtonTag disabled={swapDisabled}>Swap</ButtonTag>
        </ButtonContainer>
      </Panel>
    </Center>
  )
}

function useTokenAllowance(contract, spenderAddress) {
  const { account, library } = useWeb3React()
  if (!account || !library || !contract) {
    return undefined
  }

  const { data: allowance, mutate } = useSWR([contract.address, 'allowance', account, spenderAddress])

  useEffect(() => {
    const approvalFilter = contract.filters.Approval(account, spenderAddress)

    const onApproval = (owner, spender, amount) => {
      console.log('Approval', { owner, spender, amount })
      mutate(undefined, true)
    }

    library.on(approvalFilter, onApproval)

    return () => {
      library.off(approvalFilter, onApproval)
    }

  }, [account, spenderAddress])

  return allowance
}

function parseAmount(amount) {
  return TEN_TO_18.mul(Math.floor(Number(amount) * DISPLAY_MULT)).div(DISPLAY_MULT)
}

function formatAmount(wei) {
  return (wei.mul(DISPLAY_MULT).div(TEN_TO_18).toNumber() / DISPLAY_MULT).toFixed(DISPLAY_PRECISION)
}
