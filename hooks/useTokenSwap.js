import { BigNumber } from '@ethersproject/bignumber'
import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import useSWR from 'swr'

import { TokenIds } from '../utils'

import useToken from './useToken'

const MAX_AMOUNT = BigNumber.from(2).pow(256).sub(1)
const NUM_TX_CONFIRMATIONS = 1


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
  const [isTransacting, setIsTransacting] = useState(false)
  const [txHash, setTxHash] = useState(null)

  const updateTransacting = (newIsTransacting) => {
    if (isTransacting && !newIsTransacting) {
      tokenFrom.invalidateBalance()
      tokenTo.invalidateBalance()
    }
    setIsTransacting(newIsTransacting)
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
    isTransacting,
    txHash,
    doApprove: wrapTx(updateTransacting, setTxHash, approveFn, NUM_TX_CONFIRMATIONS),
    doSwap: wrapTx(updateTransacting, setTxHash, swapFn, NUM_TX_CONFIRMATIONS),
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

function wrapTx(setIsTransacting, setTxHash, txFn, numConfirmations = 1) {
  return async () => {
    try {
      setIsTransacting(true)
      const tx = await txFn()
      setTxHash(tx.hash)
      await tx.wait(numConfirmations)
    } finally {
      setIsTransacting(false)
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
