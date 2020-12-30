import { BigNumber } from '@ethersproject/bignumber'
import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import useSWR from 'swr'

import { TokenIds } from '../utils'

import useToken from './useToken'

const MAX_AMOUNT = BigNumber.from(2).pow(256).sub(1)


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

  const isApprovalSufficient = !isFetching && approvedAmount.gte(amountFrom)

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
    doApprove,
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
