import { BigNumber } from '@ethersproject/bignumber'
import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import useSWR from 'swr'

import { TokenIds } from '../utils'

import useToken from './useToken'

const MAX_AMOUNT = BigNumber.from(2).pow(256).sub(1)
const NUM_TX_CONFIRMATIONS = 1

export const TX_APPROVE = 'approve'
export const TX_SWAP = 'swap'


export default function useTokenSwap(assetFrom, assetTo, amountFrom) {
  const isSubmit = assetFrom === 'eth'
  const isDeposit = assetFrom === TokenIds.STETH

  const tokenFrom = useToken(assetFrom)
  const tokenTo = useToken(assetTo)
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

  const isFetching = tokenFrom.balance === undefined || approvedAmount === undefined
  const [txType, setTxType] = useState(null)
  const [txHash, setTxHash] = useState(null)

  const updateTx = (newTxType) => {
    if (txType && !newTxType) {
      tokenFrom.invalidateBalance()
      tokenTo.invalidateBalance()
    }
    setTxType(newTxType)
  }

  const isApprovalSufficient = !isFetching && approvedAmount.gte(amountFrom)

  const approveFn = isDeposit
    ? () => tokenFrom.contract.approve(vault.address, MAX_AMOUNT)
    : nop

  const swapFn = makeSwapFn(isDeposit, isSubmit, amountFrom, vault)

  return {
    isSubmit,
    isDeposit,
    balanceFrom: tokenFrom.balance,
    balanceTo: tokenTo.balance,
    isApprovalSufficient,
    stEthPerYvstEth,
    isFetching,
    txType,
    txHash,
    doApprove: wrapTx(TX_APPROVE, approveFn, updateTx, setTxHash, NUM_TX_CONFIRMATIONS),
    doSwap: wrapTx(TX_SWAP, swapFn, updateTx, setTxHash, NUM_TX_CONFIRMATIONS),
  }
}

function makeSwapFn(isDeposit, isSubmit, fromAmount, vault) {
  if (isDeposit) {
    return () => vault['deposit(uint256)'](fromAmount)
  }
  if (isSubmit) {
    return () => {
      const { signer } = vault
      return signer.sendTransaction({ to: vault.address, value: fromAmount })
    }
  }
  // is withdrawal
  return () => vault['withdraw(uint256)'](fromAmount)
}

function wrapTx(txType, txFn, setTxType, setTxHash, numConfirmations) {
  return async () => {
    try {
      setTxType(txType)
      const tx = await txFn()
      setTxHash(tx.hash)
      await tx.wait(numConfirmations)
    } finally {
      setTxType(null)
      setTxHash(null)
    }
  }
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

function nop() {}
