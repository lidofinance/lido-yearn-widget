import { formatEther } from '@ethersproject/units'

import ERC20ABI from '../abi/ERC20.abi.json'
import VaultABI from '../abi/LidoVault.abi.json'

export const Networks = {
  MainNet: 1,
  Rinkeby: 4,
}

export const TokenIds = {
  STETH: 'steth',
  YVSTETH: 'yvsteth',
}

export const VALID_TOKEN_IDS = Object.entries(TokenIds).map(e => e[1])

export const TOKENS_BY_ID = {
  [TokenIds.STETH]: {
    id: 'steth',
    name: 'stETH',
    symbol: 'stETH',
    decimals: 18,
    abi: ERC20ABI,
  },
  [TokenIds.YVSTETH]: {
    id: 'yvsteth',
    symbol: 'yvstETH',
    name: 'yvstETH',
    decimals: 18,
    abi: VaultABI,
  },
}

export const ADDRESSES_BY_NETWORK = {
  [Networks.MainNet]: {
    [TokenIds.STETH]: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
    [TokenIds.YVSTETH]: '0x15a2B3CfaFd696e1C783FE99eed168b78a3A371e',
  },
  [Networks.Rinkeby]: {
    [TokenIds.STETH]: '0xba453033d328bfdd7799a4643611b616d80ddd97',
    [TokenIds.YVSTETH]: '0x01e68713da545f5dbead4c39a922892b93bffe66',
  },
}

export function formatEth(eth) {
  return parseFloat(formatEther(eth || '0')).toPrecision(6)
}

export function getTokenConfig(tokenId, networkId) {
  tokenId = tokenId.toLowerCase()
  const tokenConfig = TOKENS_BY_ID[tokenId]
  const netAddresses = ADDRESSES_BY_NETWORK[networkId] || {}
  return tokenConfig ? { ...tokenConfig, address: netAddresses[tokenId] } : null
}
