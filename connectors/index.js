import { InjectedConnector } from '@web3-react/injected-connector'
import { Networks } from '../utils'

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    Networks.MainNet, // Mainet
    Networks.Rinkeby, // Rinkeby
  ],
})
