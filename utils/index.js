import { formatEther } from '@ethersproject/units'
import ERC20ABI from '../abi/ERC20.abi.json'

export const Networks = {
  MainNet: 1,
  Rinkeby: 4,
}

export const TOKENS_BY_NETWORK = {
  [Networks.MainNet]: [
    {
      address: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
      name: 'stETH',
      symbol: 'stETH',
      decimals: 18,
      abi: ERC20ABI,
    },
    {
      address: '0x15a2B3CfaFd696e1C783FE99eed168b78a3A371e',
      symbol: 'yvstETH',
      name: 'yvstETH',
      decimals: 18,
      abi: ERC20ABI,
    },
  ],
  [Networks.Rinkeby]: [
    {
      address: '0xba453033d328bfdd7799a4643611b616d80ddd97',
      name: 'stETH',
      symbol: 'stETH',
      decimals: 18,
      abi: ERC20ABI,
    },
    {
      address: '0x01e68713da545f5dbead4c39a922892b93bffe66',
      symbol: 'yvstETH',
      name: 'yvstETH',
      decimals: 18,
      abi: ERC20ABI,
    },
  ],
}

export function formatEth(eth) {
  return parseFloat(formatEther(eth || '0')).toPrecision(6)
}
