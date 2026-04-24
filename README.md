# Web3 Hub — Next.js + Wagmi

Multi-wallet Web3 dApp: MetaMask · Coinbase · WalletConnect  
Chain switching · Send transactions · Sign messages

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Setup

1. Get a free WalletConnect Project ID at https://cloud.walletconnect.com
2. Replace `YOUR_WALLETCONNECT_PROJECT_ID` in `src/lib/wagmi.ts`

## Project Structure

```
src/
├── app/
│   ├── layout.tsx       ← Root layout with Providers
│   ├── providers.tsx    ← WagmiProvider + QueryClientProvider
│   ├── page.tsx         ← Main UI (connect, switch chain, send, sign)
│   └── globals.css
└── lib/
    └── wagmi.ts         ← Config: connectors + chains + transports
```

## Hooks Used

| Hook                | Purpose                        |
|---------------------|--------------------------------|
| `useAccount`        | Address, connection status     |
| `useConnect`        | Connect with any connector     |
| `useDisconnect`     | Disconnect wallet              |
| `useChainId`        | Current chain ID               |
| `useSwitchChain`    | Switch network                 |
| `useBalance`        | Native token balance           |
| `useSendTransaction`| Send ETH/native token          |
| `useSignMessage`    | Sign arbitrary message (EIP-191)|

## Supported Chains
mainnet · polygon · arbitrum · optimism · base
