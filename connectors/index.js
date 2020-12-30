import { InjectedConnector } from '@web3-react/injected-connector'
import { Chains } from '../utils'

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    Chains.MainNet, // Mainet
    Chains.Rinkeby, // Rinkeby
  ],
})
