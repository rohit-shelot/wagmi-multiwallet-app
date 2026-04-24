import { http, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { metaMask, coinbaseWallet, walletConnect } from 'wagmi/connectors';

const projectId = 'YOUR_WALLETCONNECT_PROJECT_ID';

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    metaMask(),
    coinbaseWallet({ appName: 'Web3 Hub' }),
    walletConnect({ projectId }),
  ],
  transports: {
    [sepolia.id]: http(),
  },
});